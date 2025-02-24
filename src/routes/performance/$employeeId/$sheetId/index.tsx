import { createFileRoute, Link } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePerformanceSheets, usePerformanceTemplates } from "@/hooks/usePerformance";
import { useUserData } from "@/hooks/useUserData";
import Loading from "@/components/Loading";

export const Route = createFileRoute("/performance/$employeeId/$sheetId/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { employeeId, sheetId } = useParams({ strict: false });
    const { workspaceid } = useUserData();
    const { sheet, loading: sheetLoading, error: sheetError } = usePerformanceSheets({
        employeeId: Number(employeeId),
        sheetId: Number(sheetId)
    });

    // Get template after sheet is loaded
    const { templates, loading: templateLoading } = usePerformanceTemplates();
    const [scores, setScores] = useState<Record<string, number>>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (sheet?.scores) {
            const initialScores = sheet.scores.reduce((acc, score) => ({
                ...acc,
                [score.pointId]: score.score
            }), {});
            setScores(initialScores);
        }
    }, [sheet]);

    if (sheetLoading || templateLoading) return <Loading />;
    if (sheetError) return <div>Error: {sheetError}</div>;
    if (!sheet?.template) return <div>Sheet not found</div>;

    // Find the matching template
    const template = templates.find(t => t.templateid === sheet.template.templateId);
    if (!template) return <div>Template not found</div>;

    const chartConfig = template.categories.reduce((acc, category, index) => ({
        ...acc,
        [category.categoryname]: {
            label: category.categoryname,
            color: `hsl(var(--chart-${index + 1}))`,
        },
    }), {});

    const chartData = template.categories.map(category => ({
        name: category.categoryname,
        value: category.points.reduce((sum, point) => {
            const score = scores[point.pointid] || 0;
            return sum + score;
        }, 0),
    }));

    const handleScoreChange = (pointId: number, value: string) => {
        const numValue = Math.min(100, Math.max(0, Number(value) || 0));
        setScores(prev => ({
            ...prev,
            [pointId]: numValue
        }));
    };

    const handleEditSave = () => {
        if (isEditing) {
            console.log("Saving scores:", {
                employeeId: sheet.employee.employeeId,
                sheetId: sheet.sheetId,
                scores
            });
            // TODO: Implement save functionality
        }
        setIsEditing(!isEditing);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header Sections */}
            <div className="flex-none min-h-0 px-2 py-4 bg-white border-b">
                <div className="container flex justify-between gap-8 md:px-6">
                    {sheet.employee.name}'s Performance Review
                    <Link 
                        to="/performance/setting/$templateId" 
                        params={{templateId: template.templateid.toString()}}
                    >
                        Setting
                    </Link>
                </div>
            </div>

            <div className="flex-none min-h-0 px-2 py-4 bg-gray-100 border-b">
                <div className="container flex gap-8 md:px-6">
                    <h1>Sheet Details</h1>
                    <div>Created: {new Date(sheet.createdDate).toLocaleDateString()}</div>
                </div>
            </div>

            <div className="flex-none min-h-0 px-8 py-4 border-b">
                <h1 className="py-4 text-base">
                    {sheet.template.name}
                </h1>
            </div>

            {/* Edit/Save Button */}
            <div className="flex justify-end flex-none bg-white">
                <Button
                    onClick={handleEditSave}
                    className="w-20 text-black bg-transparent border cursor-pointer h-15"
                    variant="outline"
                >
                    {isEditing ? "SAVE" : "EDIT"}
                </Button>
            </div>

            {/* Main Content */}
            <div className="grid h-full grid-cols-2">
                {/* Score Chart Section */}
                <Card className="flex flex-col h-full border rounded-none">
                    <CardContent className="flex-1">
                        <p className="pt-4">Total Score: {sheet.totalScore}</p>
                        <ChartContainer
                            config={chartConfig}
                            className="w-full h-full min-h-[500px] flex items-center justify-center"
                        >
                            <PieChart width={500} height={500}>
                                <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent />}
                                />
                                <Pie
                                    data={chartData}
                                    dataKey="value"
                                    nameKey="name"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={100}
                                    outerRadius={200}
                                    labelLine={false}
                                >
                                    {chartData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={chartConfig[entry.name].color}
                                        />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ChartContainer>
                    </CardContent>
                </Card>

                {/* Performance Details Section */}
                <div className="flex flex-col h-full bg-white border">
                    {template.categories.map((category) => (
                        <div key={category.categoryid} className="mb-4 border">
                            <div
                                className="flex items-center gap-4"
                                style={{ backgroundColor: chartConfig[category.categoryname].color }}
                            >
                                <div className="flex-1 p-4">
                                    <span className="font-medium text-white">
                                        {category.categoryname}
                                    </span>
                                </div>
                                <div className="flex">
                                    <div className="w-20 p-4 text-center text-white">Score</div>
                                    <div className="w-20 p-4 text-center text-black bg-white">Weight</div>
                                </div>
                            </div>

                            {category.points.map((point) => (
                                <div key={point.pointid} className="flex items-center border-t">
                                    <div className="flex-1 p-4">
                                        <span>{point.pointname}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-20 border-l">
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                value={scores[point.pointid] || 0}
                                                onChange={(e) => handleScoreChange(point.pointid, e.target.value)}
                                                className="h-full text-center border-none"
                                                disabled={!isEditing}
                                                enableEmoji={false}
                                            />
                                        </div>
                                        <div className="w-20 p-4 text-center border border-b-0">
                                            {point.weight}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
