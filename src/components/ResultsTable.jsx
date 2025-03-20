import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const ResultsTable = ({ data }) => {
  if (!data) return null

  const { recordCount, ageDistribution } = data

  return (
    <Card className="w-full mt-8">
      <CardHeader>
        <CardTitle>Processing Results</CardTitle>
        <CardDescription>
          Successfully processed {recordCount} records
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>Age distribution across all users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Age Group</TableHead>
              <TableHead className="text-right">Percentage (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(ageDistribution).map(([group, percentage]) => (
              <TableRow key={group}>
                <TableCell className="font-medium">{group}</TableCell>
                <TableCell className="text-right">{percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default ResultsTable