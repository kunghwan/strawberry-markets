import { PropsWithChildren } from "react";
import AppProvider from "./AuthProvider";

const App = ({ children }: PropsWithChildren) => {
  return <AppProvider>{children}</AppProvider>;
};

export default App;
