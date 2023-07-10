import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { parse, type ParseResult } from "papaparse";
import { type RubricRow } from "../types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./GradeTable.module.css";

const pointContainerStyle = { display: 'flex', justifyContent: 'center', alignItems: 'center' }
const PointsAwarded = ({points, total}: {points: number, total?: number}) => {
  let pct = 0
  if (total !== undefined) {
    pct = points/total
  }
  const pointBgStyle = { backgroundColor: `rgba(${255 * (1-pct)},${255 * (pct)}, 0, 0.33)`}
  return (
    <div style={pointContainerStyle}>
      <div className={styles.cellPoints} style={total ? pointBgStyle : {}}>
        {points}
      </div>
    </div>
  )
}

const PointsPossible = ({points}: {points: number}) => {
  return (
    <div style={pointContainerStyle}>
      <div className={styles.cellPoints}>
        {points}
      </div>
    </div>
  )
}

const Comments = ({comments}: {comments: string}) => {
  return (
    <div className={styles.cellComments}>
      {comments}
    </div>
  )
}

const SkillTested = ({skill}: {skill: string}) => {
  return (
    <div className={styles.cellSkillTested}>
      {skill}
    </div>
  )
}
const colHelper = createColumnHelper<RubricRow>();
const columns = [
  colHelper.accessor("skillTested", {
    cell: (info) => <SkillTested skill={info.getValue() ?? ''} />,
    header: () => <div>Skill Tested</div>,
  }),
  colHelper.accessor("pointsAwarded", {
    cell: (info) => <PointsAwarded points={Number(info.row.original.pointsAwarded)} total={Number(info.row.original.pointsPossible)}/>,
    header: () => <div>Awarded</div>,
  }),
  colHelper.accessor("pointsPossible", {
    cell: (info) => <PointsPossible points={Number(info.getValue())} />,
    header: () => <div>Possible</div>,
  }),
  colHelper.accessor("comments", {
    cell: (info) => <Comments comments={info.getValue() ?? ''} />,
    header: () => <div>Comments</div>,
  }),
];

// const csvUrl = new URL(`data/csv/Q1/0083.csv`, import.meta.url).href
const csvFiles = Object.values(
  import.meta.glob("data/csv/**/*.csv", { eager: true })
).map((v) => (v as any)?.default);



export const GradeTable = () => {
  const { questionNo = "unknown", studentId = "unknown" } = useParams();
  const [gradeCsv, setGradeCsv] = useState<RubricRow[]>([]);
  console.log(csvFiles);
  const table = useReactTable({
    data: gradeCsv,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  useEffect(() => {
    const path = csvFiles.filter((uri: string) => {
      console.log(uri, studentId);
      return uri.includes(`${questionNo}/${studentId}`);
    })?.[0];
    parse(path, {
      download: true,
      header: true,
      transformHeader: (header: string) => {
        return header.split(" ").reduce<string>((acc, val, idx) => {
          if (idx === 0) return `${val.toLowerCase()}`;
          return `${acc}${val}`;
        }, "");
      },
      error: (error: Error) => console.error(error),
      complete: (results: ParseResult<RubricRow>) => {
        console.log(results);
        setGradeCsv(results.data.filter(res => !!res.skillTested));
      },
    });
  }, [studentId]);

  return (
    <div className="p-2">
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="h-4" />
    </div>
  );
};
