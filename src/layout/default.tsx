import Header from "@/components/Header";
import TabMenu from "@/components/TabMenu";
import React from "react";

const DefaultLayout: React.FC = (props: any) => {
    const { collapsed, userInfo, changeCollapsed } = props
    // () => setCollapsed(!collapsed)
    return (
        <>
            <aside>
                <TabMenu collapsed={collapsed} />
            </aside>
            <div className="main">
                <Header userInfo={userInfo} collapsed={collapsed} changeCollapsed={changeCollapsed} />
                {props.children}
            </div>
        </>
    )
}

export default DefaultLayout