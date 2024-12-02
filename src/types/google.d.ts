interface GoogleCredentialResponse {
  credential: string;
  select_by: string;
}

interface PromptNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
  getNotDisplayedReason: () => string;
  getSkippedReason: () => string;
  getDismissedReason: () => string;
  getMomentType: () => string;
}

interface Window {
  google: {
    accounts: {
      id: {
        initialize: (config: {
          client_id: string;
          callback: (response: GoogleCredentialResponse) => void;
          auto_select?: boolean;
          cancel_on_tap_outside?: boolean;
          use_fedcm_for_prompt?: boolean;
        }) => void;
        prompt: (notification?: (notification: PromptNotification) => void) => void;
        renderButton: (
          parent: HTMLElement,
          options: {
            theme?: string;
            size?: string;
            text?: string;
            width?: number;
          }
        ) => void;
      };
    };
  };
} 