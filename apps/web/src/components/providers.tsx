"use client";

import { HeroUIProvider } from "@heroui/react";

function Providers({ children }: { children: React.ReactNode }) {
	return <HeroUIProvider disableRipple>{children}</HeroUIProvider>;
}

export default Providers;
