import { ReactElement, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactElement;
}

const PrivateRoute: React.FC<Props> = ({ children }: Props) => {
  const navigator = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigator("/login");
    }
  }, []);

  return <>{children}</>;
};

export default PrivateRoute;
