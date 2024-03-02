import React, { FC } from "react";
import Navbar from "./Navbar";
import { getClasses } from "../utils/getClasses";
import styles from "../styles/modules/layout.module.scss";

interface Layout {
  children: React.ReactNode;
}

const Layout: FC<Layout> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main className={getClasses([styles.wrapper])}>
        <div className={getClasses([styles.container])}>{children}</div>
      </main>
    </>
  );
};

export default Layout;
