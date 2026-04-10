import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";
import { Mail, ArrowUpRight } from "lucide-react";
import SumaLogo from "/images/SumaWhite.jpeg";

function FooterLanding() {
  const footerLinks = {
    Company: [
      { label: "Home", href: "/#home" },
      { label: "About Us", href: "/#about" },
      { label: "Services", href: "/#services" },
      { label: "Contact", href: "/#contact" },
    ],
    Industries: [
      { label: "Insurance", href: "#" },
      { label: "Real Estate", href: "#" },
      { label: "Healthcare", href: "#" },
      { label: "Education", href: "#" },
      { label: "E-commerce", href: "#" },
    ],
    Legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: <FaFacebook size={18} />, href: "#" },
    { icon: <FaTwitter size={18} />, href: "#" },
    { icon: <FaLinkedin size={18} />, href: "#" },
    { icon: <FaInstagram size={18} />, href: "#" },
  ];

  return (
    <footer className="relative bg-[#020617] pt-24 pb-12 px-6 md:px-12 overflow-hidden border-t border-slate-900">
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Logo & About */}
          <div className="lg:col-span-4 max-w-sm">
            <a href="/" className="group inline-block">
              <img
                src={SumaLogo}
                alt="Suma Logo"
                className="h-10 w-auto mb-6 rounded-lg transition-transform group-hover:scale-105"
              />
            </a>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              Suma.ai is the next generation of AI calling agents. We combine 
              cutting-edge NLP with human-like conversation DNA to transform 
              how businesses communicate.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social, i) => (
                <a 
                  key={i} 
                  href={social.href} 
                  className="w-10 h-10 rounded-xl glass border-slate-800 flex items-center justify-center text-slate-400 hover:text-brand-primary hover:border-brand-primary transition-all shadow-xl"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[2px] text-[10px] mb-6">Company</h4>
            <ul className="flex flex-col gap-4">
              {footerLinks.Company.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-slate-400 text-sm hover:text-white transition-colors flex items-center gap-1 group">
                    {link.label}
                    <ArrowUpRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-y-1" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[2px] text-[10px] mb-6">Industries</h4>
            <ul className="flex flex-col gap-4">
              {footerLinks.Industries.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-slate-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[2px] text-[10px] mb-6">Legal</h4>
            <ul className="flex flex-col gap-4">
              {footerLinks.Legal.map((link, i) => (
                <li key={i}>
                  <a href={link.href} className="text-slate-400 text-sm hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-black uppercase tracking-[2px] text-[10px] mb-6">Support</h4>
            <div className="flex flex-col gap-4">
              <a href="mailto:pia@bysuma.com" className="flex items-center gap-3 glass border-slate-800 p-4 rounded-2xl hover:border-brand-primary transition-all group">
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase">Email Us</p>
                  <p className="text-xs font-bold text-white group-hover:text-brand-primary">pia@bysuma.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} Suma.ai. All rights reserved.
          </p>
          <div className="flex gap-8">
            <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest">Built for the future of calling</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default FooterLanding;
