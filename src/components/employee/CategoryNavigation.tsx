import { cn } from "../../lib/utils";

interface CategoryNavigationProps {
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

const CategoryNavigation = ({ activeCategory, onCategoryChange }: CategoryNavigationProps) => {
    const categories = [
        { id: "all", label: "All Data Category" },
        { id: "basic", label: "Basic Information" },
        { id: "sns", label: "SNS" },
        { id: "contracts", label: "Contracts" },
    ];

    return (
        <div className="bg-white border-b">
            <div className="container flex items-center h-12">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => onCategoryChange(cat.id)}
                        className={cn(
                            "px-4 h-full text-sm border-b-2 transition-colors",
                            activeCategory === cat.id
                                ? "border-black text-black"
                                : "border-transparent text-neutral-500 hover:text-black"
                        )}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategoryNavigation;
