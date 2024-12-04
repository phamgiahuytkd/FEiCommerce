

import './App.css';
import MenuAdmin from './component/admin/MenuAdmin';
import Menu from './component/user/Menu';
import { jwtDecode } from 'jwt-decode';



function App() {
  const token = localStorage.getItem('token');
  let role = null;
  if (token){
    const decodedToken = jwtDecode(token);
    role = decodedToken.scope;
  }

  return (
    <div>
      {role === 'ADMIN' ? (
        <MenuAdmin />
      ) : (
        <Menu />
      )}
    </div>

    

  );
}

export default App;
