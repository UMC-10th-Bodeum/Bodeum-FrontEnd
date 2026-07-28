import { useState, type ReactNode } from "react";
import { MyPageProfileContext } from "./myPageProfileContext";
import { initialProfileSettings } from "./settings/data";
import type { ProfileSettingsForm } from "./settings/types";

const cloneProfile = (profile: ProfileSettingsForm): ProfileSettingsForm => ({
  ...profile,
  diagnoses: [...profile.diagnoses],
});

export default function MyPageProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState(() => cloneProfile(initialProfileSettings));

  const saveProfile = (nextProfile: ProfileSettingsForm) => {
    setProfile(cloneProfile(nextProfile));
  };

  return (
    <MyPageProfileContext.Provider value={{ profile, saveProfile }}>
      {children}
    </MyPageProfileContext.Provider>
  );
}
