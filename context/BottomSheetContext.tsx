import BottomSheet from "@/components/feedback/BottomSheet";
import React, {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type BottomSheetContextType = {
  show: (children: React.ReactNode) => void;
  hide: () => void;
};

const BottomSheetContext = createContext<BottomSheetContextType | undefined>(
  undefined
);

export const BottomSheetProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [content, setContent] = useState<React.ReactNode>(null);

  const show = useCallback((node: React.ReactNode) => {
    setContent(node);
    bottomSheetRef.current?.show();
  }, []);

  const hide = useCallback(() => {
    bottomSheetRef.current?.hide();
  }, []);

  return (
    <BottomSheetContext.Provider value={{ show, hide }}>
      {children}
      <BottomSheet ref={bottomSheetRef}>{content}</BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export const useBottomSheet = () => {
  const context = useContext(BottomSheetContext);
  if (!context) {
    throw new Error("useBottomSheet must be used inside BottomSheetProvider");
  }
  return context;
};
