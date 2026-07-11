import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface BreadcrumbContextType {
  breadcrumb: string[];
  setBreadcrumb: React.Dispatch<React.SetStateAction<string[]>>;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export function BreadcrumbProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [breadcrumb, setBreadcrumb] = useState<string[]>([]);

  return (
    <BreadcrumbContext.Provider
      value={{
        breadcrumb,
        setBreadcrumb,
      }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function useBreadcrumb() {
  const context = useContext(BreadcrumbContext);

  if (!context) {
    throw new Error("BreadcrumbProvider가 필요합니다.");
  }

  return context;
}