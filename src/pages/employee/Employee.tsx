import EmployeeList from "../../components/table/employeeList";
import Tabs from "../../components/tabs/tabs";

const Employee = () => {
  console.log("emplyee");

  return (
    <div className=" h-full w-full container py-2">
      <Tabs
        tabList={[
          { key: "List", label: <span>List</span> },
          { key: "Table", label: <span>Table</span> },
          { key: "Setting", label: <span>Setting</span> },
        ]}
        defaultKey="List"
        tabContents={[
          {
            key: "List",
            content: <EmployeeList />,
          },
          { key: "Table", content: <span>Table</span> },
          { key: "Setting", content: <span>Setting</span> },
        ]}
      />
    </div>
  );
};

export default Employee;
