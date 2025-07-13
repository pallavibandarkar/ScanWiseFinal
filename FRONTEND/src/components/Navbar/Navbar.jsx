import { useState } from 'react'; 
import './Navbar.css'
import FindInPageIcon from '@mui/icons-material/FindInPage';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router';


export default function Navbar({toggleSidebar}){
    const { user,logout,BASE_URL } = useAuth();
    const navigate = useNavigate();
    // const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    // const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    
    return(
        <>
        <nav className="navbar">
            <div>
                <Stack direction="row" alignItems="center" spacing={1}>
                    {user && (
                        <button className="menu-btn" onClick={toggleSidebar}>
                            <MenuIcon />
                        </button>
                    )}
                    <FindInPageIcon color="primary" fontSize="large" className='home' onClick={()=> navigate('/scanwise')}/>
                    <Typography variant="h6" component="div" color="primary" fontWeight={600} fontSize={20}  className='home' onClick={()=> navigate('/scanwise')}>
                    ScanWise
                    </Typography>
                </Stack>
            </div>
            <div className="nav-btns">
                {!user ? (
                <>
                    <Button variant="outlined" className="btn" onClick={() => navigate('/scanwise/auth')}>
                        Login
                    </Button>
                    <Button variant="contained" className="btn" onClick={() => navigate('/scanwise/auth')}>
                        Sign Up
                    </Button>
                </>
                ) : (
                    <Button variant="outlined" className="btn" onClick={()=>navigate('/scanwise/dashboard')}>
                        Dashboard
                    </Button>
                )}
            </div>
        </nav>
        </>
    )
}