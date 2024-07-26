import type React from "react";
import "./global.css";
import { Providers } from "@/component/WagmiProvider";

function App({
	children, // will be a page or nested layout
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}

export default App;
