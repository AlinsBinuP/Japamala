import React, { useState, useCallback, useRef } from 'react';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { rosaryData } from './data/rosaryContent';
import './index.css';

const Page = ({ title, content, image, pageNumber, section }) => {
  const isLitany = section === 'litany';
  const pageClass = `page page-${section} ${isLitany ? 'page-litany' : ''}`;

  const formatLitanyLine = (line) => {
    if (!isLitany) return line;
    if (line.includes(' - ')) {
      const [call, resp] = line.split(' - ');
      return `${call}<span class="litany-response">${resp}</span>`;
    }
    if (line.includes('...')) {
      const call = line.replace('...', '');
      return `${call}<span class="litany-response">ഞങ്ങൾക്കുവേണ്ടി അപേക്ഷിക്കണമേ.</span>`;
    }
    return line;
  };

  const formatPrayerContent = (text) => {
    if (typeof text !== 'string') return text;
    let formatted = isLitany ? formatLitanyLine(text) : text;
    return formatted.replace(/(\(.*?\))/g, '<span class="prayer-action">$1</span>');
  };

  return (
    <div className={pageClass}>
      <div className="page-content">
        {title && <h2>{title}</h2>}

        {image && (
          <div className="mystery-card-image" style={{ '--bg-url': `url(/images/${image}.png)` }}>
            <img src={`/images/${image}.png`} alt={title} />
          </div>
        )}

        <div className="text-container">
          {content.map((paragraph, pIndex) => (
            <p
              key={pIndex}
              dangerouslySetInnerHTML={{ __html: formatPrayerContent(paragraph) }}
            />
          ))}
        </div>
      </div>
      <div className="page-number">Page {pageNumber}</div>
    </div>
  );
};

// All "pages" in order: front cover, content pages, back cover
const TOTAL_PAGES = rosaryData.length + 2;

function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('rosary_page');
    return saved !== null ? Math.min(parseInt(saved, 10), TOTAL_PAGES - 1) : 0;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const goToPage = useCallback((index) => {
    const clamped = Math.max(0, Math.min(index, TOTAL_PAGES - 1));
    setCurrentPage(clamped);
    localStorage.setItem('rosary_page', clamped.toString());
    setIsMenuOpen(false);
  }, []);

  const goNext = () => goToPage(currentPage + 1);
  const goPrev = () => goToPage(currentPage - 1);

  const menuItems = [
    { label: 'മുഖചിത്രം', target: 0 },
    { label: 'ഉയിർപ്പുകാല ജപം', target: 1 },
    { label: 'വിശുദ്ധവാര ജപം', target: 2 },
    { label: 'ത്രിസന്ധ്യാജപം', target: 3 },
    { label: 'പ്രാരംഭ പ്രാർത്ഥനകൾ', target: 4 },
    { label: 'സന്തോഷ രഹസ്യങ്ങൾ', target: 5 },
    { label: 'പ്രകാശ രഹസ്യങ്ങൾ', target: 10 },
    { label: 'ദുഃഖ രഹസ്യങ്ങൾ', target: 15 },
    { label: 'മഹിമ രഹസ്യങ്ങൾ', target: 20 },
    { label: 'ജപമാല സമർപ്പണം', target: 25 },
    { label: 'ലുത്തിനിയ', target: 26 },
  ];

  // Determine what to render for the current page index
  const renderCurrentPage = () => {
    // Page 0 = Front Cover
    if (currentPage === 0) {
      return (
        <div className="page page-cover">
          <div className="page-content">
            <h1>പരിശുദ്ധ ജപമാല</h1>
            <div className="cover-accent"></div>
            <p style={{ color: 'white', opacity: 0.7 }}>Holy Rosary Malayalam</p>
          </div>
        </div>
      );
    }

    // Last page = Back Cover
    if (currentPage === TOTAL_PAGES - 1) {
      return (
        <div className="page page-cover" style={{
          backgroundImage: "url('/images/litany.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}>
          <div className="page-content">
            <h1>ആമ്മേൻ</h1>
            <div className="cover-accent"></div>
            <p style={{ color: 'white', opacity: 0.9 }}>ദൈവം അനുഗ്രഹിക്കട്ടെ</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginTop: '1.5rem', letterSpacing: '0.05rem' }}>Made for Light Suvara</p>
          </div>
        </div>
      );
    }

    // Content pages (index 1 to rosaryData.length)
    const dataIndex = currentPage - 1;
    const item = rosaryData[dataIndex];
    if (!item) return null;

    let section = 'mystery';
    if (dataIndex < 4) section = 'intro';
    else if (item.title && (item.title.includes('ലുത്തിനിയ') || item.title.includes('ജപമാല സമർപ്പണം'))) section = 'litany';
    else if (dataIndex > 26) section = 'conclusion';

    return (
      <Page
        title={item.title}
        content={item.content}
        image={item.image}
        pageNumber={currentPage}
        section={section}
      />
    );
  };

  return (
    <div className="app-container">
      {/* Navigation Toggle */}
      <button className="menu-toggle" onClick={() => setIsMenuOpen(true)}>
        <Menu size={24} />
      </button>

      {/* Navigation Modal */}
      {isMenuOpen && (
        <div className="nav-overlay" onClick={() => setIsMenuOpen(false)}>
          <div className="nav-menu" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3>ഉള്ളടക്കം</h3>
              <button
                onClick={() => setIsMenuOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
              >
                <X size={24} />
              </button>
            </div>
            {menuItems.map((item, idx) => (
              <button
                key={idx}
                className="nav-item"
                onClick={() => goToPage(item.target)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Book Display */}
      <div className="book-wrapper">
        <div
          key={currentPage}
          className="page-display"
        >
          {renderCurrentPage()}
        </div>
      </div>

      {/* Page Indicator */}
      <div className="page-indicator">
        {currentPage + 1} / {TOTAL_PAGES}
      </div>

      {/* Navigation Controls */}
      <div className="nav-controls">
        <button
          className="btn-nav"
          onClick={goPrev}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={20} /> പിന്നിലേക്ക്
        </button>
        <button
          className="btn-nav"
          onClick={goNext}
          disabled={currentPage >= TOTAL_PAGES - 1}
        >
          അടുത്തത് <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default App;
