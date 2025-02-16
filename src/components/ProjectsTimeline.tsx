import { Timeline } from "vis-timeline";
import { DataSet } from "vis-data"; 
import "vis-timeline/styles/vis-timeline-graph2d.css"; 
import moment from "moment"; 
import { ProjectType } from "../config/mockData/companies";
import { useEffect, useRef } from "react";

interface ProjectsTimelineProps {
    projects: ProjectType[];
}

export const ProjectsTimeline: React.FC<ProjectsTimelineProps> = ({
    projects,
}) => {
    const timelineRef = useRef<HTMLDivElement | null>(null);
    const timelineInstance = useRef(null);

    useEffect(() => {
        if (timelineRef.current) {
            // Format projects into timeline items
            const items = new DataSet(
                projects.map((project) => ({
                    id: project.id.toString(),
                    content: project.projectName,
                    start: moment(project.startDate).toDate(), // Convert to JavaScript Date
                    end: moment(project.endDate).toDate(), // Convert to JavaScript Date
                    className: "custom-item", // Optional: Add custom class for styling
                }))
            );

            // Initialize the timeline
            timelineInstance.current = new Timeline(
                timelineRef.current,
                items,
                {}
            );
        }

        return () => {
            // Cleanup timeline instance if needed
            if (timelineInstance.current) {
                timelineInstance.current.destroy();
                timelineInstance.current = null;
            }
        };
    }, [projects]);

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm">
            <div ref={timelineRef} style={{ height: "500px", width: "100%" }} />
        </div>
    );
};