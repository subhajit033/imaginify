import Sidebar from '@/components/shared/Sidebar';
import { UserButton } from '@clerk/nextjs';
const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='root'>
      <Sidebar />

      <div className='root-container'>
        <div className='wrapper'>{children}</div>
        
      </div>
    </main>
  );
};

export default Layout;
