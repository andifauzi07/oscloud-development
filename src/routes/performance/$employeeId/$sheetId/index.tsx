import { createFileRoute, Link } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import { Pie, PieChart, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePerformanceSheets } from "@/hooks/usePerformance";
import { useUserData } from "@/hooks/useUserData";
import Loading from "@/components/Loading";

export const Route = createFileRoute("/performance/$employeeId/$sheetId/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { employeeId, sheetId } = useParams({ strict: false });
    const { sheet, loading, error } = usePerformanceSheets({
        employeeId: Number(employeeId),
        sheetId: Number(sheetId)
    });
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

    if (loading) return <Loading />;
    if (error) return <div>Error: {error}</div>;
    if (!sheet) return <div>Sheet not found</div>;

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
                        params={{templateId: sheet.template.templateId.toString()}}
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
                        {/* Add your chart visualization here using sheet data */}
                    </CardContent>
                </Card>

                {/* Performance Details Section */}
                <div className="flex flex-col h-full bg-white border">
                    {sheet.scores.map((score) => (
                        <div key={score.pointId} className="flex items-center border-t">
                            <div className="flex-1 p-4">
                                <span>Point {score.pointId}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-20 border-l">
                                    <Input
                                        type="number"
                                        min="0"
                                        max="100"
                                        value={scores[score.pointId] || score.score}
                                        onChange={(e) => handleScoreChange(score.pointId, e.target.value)}
                                        className="h-full text-center border-none"
                                        disabled={!isEditing}
                                        enableEmoji={false}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
