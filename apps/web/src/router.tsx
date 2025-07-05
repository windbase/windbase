import { Route, Routes } from 'react-router-dom';
import EditorPage from './pages/editor';

function Router() {
	return (
		<Routes>
			<Route path="/" element={<EditorPage />} />
		</Routes>
	);
}

export default Router;
