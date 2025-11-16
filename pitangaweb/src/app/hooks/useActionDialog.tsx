import { useState, useCallback } from "react";

interface ActionDialogConfig {
  title?: string;
  description?: string;
  confirmLabel?: string;
  variant?: "default" | "destructive";
  action?: () => Promise<any> | any;
}

export function useActionDialog() {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ActionDialogConfig>({});

  const showDialog = useCallback((options: ActionDialogConfig) => {
    setConfig(options);
    setOpen(true);
  }, []);

  const handleConfirm = useCallback(async () => {
    if (config.action) {
      await config.action();
    }
    setOpen(false);
  }, [config.action]);

  return {
    open,
    setOpen,
    config,
    showDialog,
    handleConfirm,
  };
}
