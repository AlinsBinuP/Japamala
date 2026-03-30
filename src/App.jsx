import React, { useState, useRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { rosaryData } from './data/rosaryContent';
import './index.css';

const PageCover = React.forwardRef((props, ref) => {
  return (
    <div className="page page-cover" ref={ref} data-density="hard">
      <div className="page-content">
        <h1>പരിശുദ്ധ ജപമാല</h1>
        <div className="cover-accent"></div>
        <p style={{ color: 'white', opacity: 0.1 }}>Holy Rosary Malayalam</p>
      </div>
    </div>
  );
});

const Page = React.forwardRef((props, ref) => {
  const { title, content, image, pageNumber } = props;
  
  return (
    <div className="page" ref={ref}>
      <div className="page-content">
        <h2>{title}</h2>
        
        {image && (
          <div className="mystery-card-image" style={{ '--bg-url': `url(/images/${image}.png)` }}>
            <img src={`/images/${image}.png`} alt={title} />
          </div>
        )}
        
        <div className={image ? "mystery-glow-container" : ""}>
          {image && <div className="liturgical-divider">✦ ✦ ✦</div>}
          {content.map((p, idx) => (
            <p key={idx} dangerouslySetInnerHTML={{ __html: p }} />
          ))}
        </div>
        
        <div className="page-number">Page {pageNumber}</div>
      </div>
    </div>
  );
});

function App() {
  const bookRef = useRef();
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = localStorage.getItem('rosary_page');
    return saved !== null ? parseInt(saved, 10) : 0;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const onPage = useCallback((e) => {
    setCurrentPage(e.data);
    localStorage.setItem('rosary_page', e.data.toString());
  }, []);

  const goToPage = (index) => {
    if (bookRef.current) {
      bookRef.current.pageFlip().turnToPage(index);
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { label: 'മുഖചിത്രം', target: 0 },
    { label: 'ഉയിർപ്പുകാല ജപം', target: 1 },
    { label: 'ത്രിസന്ധ്യാജപം', target: 2 },
    { label: 'പ്രധാന പ്രാർത്ഥനകൾ', target: 3 },
    { label: 'സന്തോഷ രഹസ്യങ്ങൾ', target: 7 },
    { label: 'പ്രകാശ രഹസ്യങ്ങൾ', target: 12 },
    { label: 'ദുഃഖ രഹസ്യങ്ങൾ', target: 17 },
    { label: 'മഹിമ രഹസ്യങ്ങൾ', target: 22 },
    { label: 'ലുത്തിനിയ', target: 28 },
  ];

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

      <div className="book-wrapper">
        <HTMLFlipBook
          width={350}
          height={550}
          size="stretch"
          minWidth={315}
          maxWidth={1000}
          minHeight={400}
          maxHeight={1533}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          onFlip={onPage}
          className="rosary-book"
          ref={bookRef}
          usePortrait={true}
          startPage={currentPage}
          flippingTime={1000}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {/* Front Cover */}
          <PageCover />

          {/* Book Content */}
          {rosaryData.map((item, index) => (
            <Page
              key={index}
              title={item.title}
              content={item.content}
              image={item.image}
              pageNumber={index + 1}
            />
          ))}

          {/* Back Cover */}
          <div className="page page-cover" data-density="hard">
            <div className="page-content">
              <h1>ആമ്മേൻ</h1>
              <div className="cover-accent"></div>
              <p style={{ color: 'white', opacity: 0.9 }}>ദൈവം അനുഗ്രഹിക്കട്ടെ</p>
            </div>
          </div>
        </HTMLFlipBook>
      </div>

      {/* Navigation Controls */}
      <div className="nav-controls">
        <button 
          className="btn-nav" 
          onClick={() => bookRef.current.pageFlip().flipPrev()}
          disabled={currentPage === 0}
        >
          <ChevronLeft size={20} /> പിന്നിലേക്ക്
        </button>
        <button 
          className="btn-nav" 
          onClick={() => bookRef.current.pageFlip().flipNext()}
          disabled={currentPage >= rosaryData.length + 1}
        >
          അടുത്തത് <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default App;
