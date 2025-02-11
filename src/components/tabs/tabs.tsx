import React from "react";
import {
  Tabs as ShadTabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../ui/tabs";

type TabList = {
  label: React.ReactNode;
  key: string;
  //   content: React.ReactNode;
};

type TabContent = {
  key: string;
  content: React.ReactNode;
};

export interface TabsType {
  tabList: TabList[];
  defaultKey: string;
  tabContents: TabContent[];
}

const Tabs: React.FC<TabsType> = ({ tabList, defaultKey, tabContents }) => {
  return (
    <ShadTabs defaultValue={defaultKey}>
      <TabsList>
        {tabList.map((item) => (
          <TabsTrigger value={item?.key} key={item.key}>
            {item?.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabContents.map((content) => (
        <TabsContent key={content.key} value={content?.key}>
          {content?.content}
        </TabsContent>
      ))}
    </ShadTabs>
  );
};

export default Tabs;
