import React from "react";
import { cn } from "../../lib/utils";

interface CategoryFilterProps {
    activeCategory: string;
    onCategoryChange: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ activeCategory, onCategoryChange }) => {
    const categories = [
        { id: "all", label: "All Data Category" },
        { id: "basic", label: "Basic Information" },
        { id: "sns", label: "SNS" },
        { id: "contracts", label: "Contracts" },
    ];

    return (
        <nav className="flex-none border-b bg-white">
            <ul className="flex h-full gap-12 list-none container px-4 md:px-6">
                {categories.map((cat) => (
                    <li key={cat.id}>
                        <button
                            onClick={() => onCategoryChange(cat.id)}
                            className={cn(
                                "block py-2 px-3 text-sm border-b-2",
                                activeCategory === cat.id
                                    ? "text-black border-black"
                                    : "text-neutral-500 border-transparent"
                            )}
                        >
                            {cat.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default CategoryFilter;
