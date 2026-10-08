import './style.css';
import './catalog.css';
import './depth.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DepthEffects from '../components/DepthEffects';
export const metadata = {title:'Wekraft Solar',description:'Authorised channel partner for Adani Solar and Deye.'};
export const viewport = {themeColor:'#252e73'};
export default function RootLayout({children}){return <html lang="en"><body id="top"><a className="skip" href="#main">Skip to content</a><Header />{children}<Footer /><DepthEffects /></body></html>;}
