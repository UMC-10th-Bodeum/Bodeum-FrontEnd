import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbContextType {
  breadcrumb: BreadcrumbItem[];
  setBreadcrumb: React.Dispatch<React.SetStateAction<BreadcrumbItem[]>>;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | null>(null);

export function BreadcrumbProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItem[]>([]);

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