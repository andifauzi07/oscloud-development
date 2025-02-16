import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { Label, Pie, PieChart, Cell } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, X } from "lucide-react";
import {
    mockTemplates,
    TemplateType,
    Category,
    CategoryItem,
} from "@/config/mockData/templates";

export const Route = createFileRoute("/performance/setting/$templateId/")({
    component: RouteComponent,
});

function RouteComponent() {
    const { templateId } = useParams({ strict: false });
    const [template, setTemplate] = useState<TemplateType | null>(null);
    const [templateName, setTemplateName] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newItemName, setNewItemName] = useState("");
    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    useEffect(() => {
        const foundTemplate = mockTemplates.find((t) => t.id === templateId);
        if (foundTemplate) {
            setTemplate(foundTemplate);
            setTemplateName(foundTemplate.name);
        }
    }, [templateId]);

    if (!template) {
        return <div>Template not found</div>;
    }

    const handleNameChange = (value: string) => {
        setTemplateName(value);
    };

    const handleAddCategory = () => {
        if (newCategory.trim() && template) {
            const newCat: Category = {
                id: Date.now().toString(),
                name: newCategory,
                score: 0,
                items: [],
                weight: 0,
                color: "",
            };
            setTemplate({
                ...template,
                categories: [...template.categories, newCat],
            });
            setNewCategory("");
            setIsPopoverOpen(false); // Close popover after adding
        }
    };

    const handleDeleteCategory = (id: string) => {
        if (template) {
            setTemplate({
                ...template,
                categories: template.categories.filter((cat) => cat.id !== id),
            });
        }
    };

    const handleAddItem = (categoryId: string) => {
        if (!newItemName.trim() || !template) return;

        const newItem: CategoryItem = {
            id: `item${Date.now()}`,
            name: newItemName,
            score: 0,
        };

        setTemplate({
            ...template,
            categories: template.categories.map((cat) =>
                cat.id === categoryId ?
                    { ...cat, items: [...cat.items, newItem] }
                :   cat
            ),
        });
        setNewItemName("");
    };

    const handleWeightChange = (categoryId: string, weight: number) => {
        if (!template) return;
        setTemplate({
            ...template,
            categories: template.categories.map((cat) =>
                cat.id === categoryId ?
                    { ...cat, weight: Math.max(0, Math.min(100, weight)) }
                :   cat
            ),
        });
    };

    const handleColorChange = (categoryId: string, color: string) => {
        if (!template) return;
        setTemplate({
            ...template,
            categories: template.categories.map((cat) =>
                cat.id === categoryId ? { ...cat, color } : cat
            ),
        });
    };

    const handleDeleteItem = (categoryId: string, itemId: string) => {
        if (!template) return;
        setTemplate({
            ...template,
            categories: template.categories.map((cat) =>
                cat.id === categoryId ?
                    {
                        ...cat,
                        items: cat.items.filter((item) => item.id !== itemId),
                    }
                :   cat
            ),
        });
    };

    const handleUpdateItem = (
        categoryId: string,
        itemId: string,
        newName: string
    ) => {
        if (!template) return;
        setTemplate({
            ...template,
            categories: template.categories.map((cat) =>
                cat.id === categoryId ?
                    {
                        ...cat,
                        items: cat.items.map((item) =>
                            item.id === itemId ?
                                { ...item, name: newName }
                            :   item
                        ),
                    }
                :   cat
            ),
        });
    };

    const handleUpdateCategoryName = (categoryId: string, newName: string) => {
        if (!template) return;
        setTemplate({
            ...template,
            categories: template.categories.map((cat) =>
                cat.id === categoryId ? { ...cat, name: newName } : cat
            ),
        });
    };

    const handleSave = () => {
        if (template) {
            const updatedTemplate = {
                ...template,
                name: templateName,
            };
            console.log("Saving template:", updatedTemplate);
            // Here you would implement saving to templates.ts
            // This would typically involve an API call in a real application
        }
    };

    const chartData = template.categories.map((category, index) => ({
        name: category.name,
        value: category.score,
        fill: category.color || `hsl(var(--chart-${index + 1}))`,
    }));

    const chartConfig = Object.fromEntries(
        template.categories.map(({ name, color }, index) => [
            name,
            {
                label: name,
                color: color || `hsl(var(--chart-${index + 1}))`,
            },
        ])
    );

    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div className="flex flex-col h-full overflow-x-hidden">
            <div className="min-h-0 border-b containerflex-none">
                <div className="container flex flex-row items-center justify-between bg-white border h-14">
                    <h1>Setting</h1>
                </div>
                <div className="container flex flex-row items-center justify-between bg-white border h-14">
                    <Input
                        value={templateName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-64 p-2 border rounded-none"
                        placeholder="Template name"
                    />
                </div>
                <div className="flex flex-row items-center justify-between bg-white h-14 ">
                    <div></div>
                    <div>
                        <Popover
                            open={isPopoverOpen}
                            onOpenChange={setIsPopoverOpen}
                        >
                            <PopoverTrigger asChild>
                                <Button
                                    className="text-black border rounded-none w-36 py-7 bg-transpa"
                                    variant="outline"
                                >
                                    NEW CATEGORY+
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                                <div className="flex flex-col gap-4">
                                    <Label>Add New Category</Label>
                                    <Input
                                        value={newCategory}
                                        onChange={(e) =>
                                            setNewCategory(e.target.value)
                                        }
                                        placeholder="Category name"
                                        className="w-full"
                                    />
                                    <Button
                                        onClick={handleAddCategory}
                                        className="w-full"
                                    >
                                        Add Category
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <Button
                            onClick={handleSave}
                            className="w-20 text-black border rounded-none py-7 bg-transpa"
                            variant="default"
                        >
                            SAVE
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <div className="grid h-full grid-cols-2">
                    <Card className="flex flex-col h-full border">
                        <CardContent className="flex-1">
                            <ChartContainer
                                config={chartConfig}
                                className="w-full h-64"
                            >
                                <PieChart width={400} height={400}>
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={renderCustomizedLabel}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={entry.fill}
                                            />
                                        ))}
                                    </Pie>
                                    <ChartTooltip
                                        content={<ChartTooltipContent />}
                                    />
                                </PieChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>

                    <div className="flex flex-col h-full p-0 bg-white border border-l-none">
                        <Accordion type="single" collapsible className="w-full">
                            {template.categories.map((category, index) => (
                                <AccordionItem
                                    key={category.id}
                                    value={category.id}
                                    className="border-0"
                                >
                                    <AccordionTrigger
                                        className="hover:no-underline p-0 m-0 [&[data-state=open]>div]:bg-opacity-90"
                                        style={{
                                            backgroundColor:
                                                category.color ||
                                                `hsl(var(--chart-${index + 1}))`,
                                        }}
                                    >
                                        <div className="flex items-center justify-between w-full px-4 py-2">
                                            <Input
                                                value={category.name}
                                                onChange={(e) =>
                                                    handleUpdateCategoryName(
                                                        category.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="w-48 bg-transparent border-0 focus:bg-white/90"
                                            />
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col gap-1">
                                                    <Label className="text-xs text-white">
                                                        Weight %
                                                    </Label>
                                                    <Input
                                                        type="number"
                                                        className="w-24 bg-transparent border-0 focus:bg-white/90"
                                                        value={
                                                            category.weight || 0
                                                        }
                                                        onChange={(e) =>
                                                            handleWeightChange(
                                                                category.id,
                                                                Number(
                                                                    e.target
                                                                        .value
                                                                )
                                                            )
                                                        }
                                                    />
                                                </div>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="w-8 h-8 p-0 border-2 border-white/50"
                                                            style={{
                                                                backgroundColor:
                                                                    category.color ||
                                                                    `hsl(var(--chart-${index + 1}))`,
                                                            }}
                                                        />
                                                    </PopoverTrigger>
                                                    <PopoverContent className="w-80">
                                                        <div className="flex flex-col gap-4">
                                                            <Label>
                                                                Pick a color
                                                            </Label>
                                                            <Input
                                                                type="color"
                                                                value={
                                                                    category.color ||
                                                                    `hsl(var(--chart-${index + 1}))`
                                                                }
                                                                onChange={(e) =>
                                                                    handleColorChange(
                                                                        category.id,
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </PopoverContent>
                                                </Popover>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleDeleteCategory(
                                                            category.id
                                                        );
                                                    }}
                                                    className="text-white hover:text-red-200 hover:bg-transparent"
                                                >
                                                    <X />
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="border-b">
                                        <div className="">
                                            {category.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between border"
                                                >
                                                    <Input
                                                        value={item.name}
                                                        onChange={(e) =>
                                                            handleUpdateItem(
                                                                category.id,
                                                                item.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        className="w-full mr-2"
                                                    />
                                                    <Button
                                                        variant="ghost"
                                                        size="lg"
                                                        onClick={() =>
                                                            handleDeleteItem(
                                                                category.id,
                                                                item.id
                                                            )
                                                        }
                                                        className="w-20 text-red-500 border rounded-none py-7 hover:text-red-700"
                                                    >
                                                        Delete
                                                    </Button>
                                                </div>
                                            ))}
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    placeholder="New item name"
                                                    value={newItemName}
                                                    onChange={(e) =>
                                                        setNewItemName(
                                                            e.target.value
                                                        )
                                                    }
                                                />
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleAddItem(
                                                            category.id
                                                        )
                                                    }
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </div>
            </div>
        </div>
    );
}
