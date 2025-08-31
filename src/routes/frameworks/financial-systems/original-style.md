<style>
  /* Financial Systems Framework color scheme - Hearts & Leaves themed */
  :root {
    --financial-primary: #D53F8C; /* Heart Magenta - love, care, connection */
    --financial-secondary: #38A169; /* Leaf Green - growth, healing, nature */
    --financial-accent: #805AD5; /* Trust Purple - wisdom, depth, spirituality */
    --financial-hearts: #E91E63; /* Hearts currency - care work, vibrant pink */
    --financial-leaves: #48BB78; /* Leaves currency - ecological restoration */
    --financial-flow: #4299E1; /* Circulation - blue for flow and trust */
    --financial-care: #D53F8C; /* Care economy - magenta for nurturing */
    --financial-wisdom: #805AD5; /* Indigenous wisdom - purple for depth */
    --financial-light: #FAD2E1; /* Light heart - pale magenta */
    --financial-dark: #B83280; /* Deep heart - dark magenta */
    --financial-abundance: #F6AD55; /* Abundance - warm orange */
    --financial-community: #4299E1; /* Community - warm blue */
  }

 /* Layout */
 .documentation-container {
   display: grid;
   grid-template-columns: 250px 1fr;
   gap: 2rem;
   max-width: 1200px;
   margin: 0 auto;
   padding: 2rem 1rem;
 }
 
 .content {
   min-width: 0;
 }
 
 .section-content {
   padding-top: 1rem;
   scroll-margin-top: 2rem; /* Adds space above when scrolled to */
 }

 /* Section Navigation */
 .section-nav {
   margin-bottom: 2rem;
   border-bottom: 1px solid #e5e7eb;
   background: linear-gradient(to bottom, #fad2e1, #e9d8fd);
   border-radius: 0.5rem;
   padding: 1rem;
 }

 .nav-section {
   margin-bottom: 0.5rem;
 }

 .nav-accordion {
   margin-bottom: 0.5rem;
   border: 1px solid #e5e7eb;
   border-radius: 0.375rem;
   overflow: hidden;
   background: white;
 }

 .accordion-header {
   width: 100%;
   display: flex;
   align-items: center;
   gap: 0.75rem;
   padding: 0.75rem 1rem;
   background: none;
   border: none;
   cursor: pointer;
   transition: all 0.2s;
   font-size: 0.95rem;
   font-weight: 500;
   color: #374151;
   text-align: left;
 }

 .accordion-header:hover {
   background-color: rgba(213, 63, 140, 0.05);
 }

 .accordion-header.has-active {
   background-color: rgba(213, 63, 140, 0.1);
   color: var(--financial-primary);
   font-weight: 600;
 }

 .accordion-header.open {
   background-color: rgba(56, 161, 105, 0.1);
   border-bottom: 1px solid #e5e7eb;
 }

 /* Special styling for overview header */
 .overview-header {
   background: linear-gradient(135deg, rgba(213, 63, 140, 0.1), rgba(56, 161, 105, 0.1));
   border-bottom: 1px solid rgba(213, 63, 140, 0.2);
 }

 .overview-header.has-active {
   background: linear-gradient(135deg, rgba(213, 63, 140, 0.15), rgba(56, 161, 105, 0.15));
 }

 .accordion-icon {
   font-size: 1.1rem;
   flex-shrink: 0;
 }

 .accordion-title {
   flex-grow: 1;
   font-weight: 600;
 }

 .section-count {
   font-size: 0.8rem;
   color: #6b7280;
   font-weight: 400;
 }

 .toggle-arrow {
   font-size: 0.8rem;
   color: #6b7280;
   transition: transform 0.2s ease;
   flex-shrink: 0;
 }

 .toggle-arrow.rotated {
   transform: rotate(180deg);
 }

 .accordion-content {
   border-top: 1px solid #e5e7eb;
   background-color: #fafafa;
 }

 .nav-item {
   width: 100%;
   display: flex;
   align-items: center;
   gap: 0.75rem;
   padding: 0.75rem 1rem;
   background: none;
   border: none;
   cursor: pointer;
   transition: all 0.2s;
   font-size: 0.9rem;
   color: #4b5563;
   text-align: left;
   border-bottom: 1px solid #e5e7eb;
   position: relative;
 }

 .nav-item:last-child {
   border-bottom: none;
 }

 .nav-item:hover {
   background-color: rgba(213, 63, 140, 0.05);
   color: #374151;
 }

 .nav-item.active {
   background-color: var(--financial-primary);
   color: white;
   font-weight: 600;
 }

 .nav-item.active:hover {
   background-color: var(--financial-secondary);
 }

 /* Special styling for featured items (at-a-glance and executive summary) */
 .featured-item {
   background: linear-gradient(135deg, rgba(213, 63, 140, 0.08), rgba(56, 161, 105, 0.08));
   border: 1px solid rgba(213, 63, 140, 0.15);
   border-radius: 0.25rem;
   margin: 0.25rem;
   padding-right: 3rem; /* Make space for badge */
 }

 .featured-item.active {
   background: var(--financial-primary);
   border-color: var(--financial-primary);
 }

 .featured-badge {
   position: absolute;
   right: 0.5rem;
   top: 50%;
   transform: translateY(-50%);
   background: var(--financial-abundance);
   color: white;
   font-size: 0.7rem;
   font-weight: 600;
   padding: 0.2rem 0.4rem;
   border-radius: 0.25rem;
   text-transform: uppercase;
   letter-spacing: 0.5px;
 }

 .featured-item.active .featured-badge {
   background: rgba(255, 255, 255, 0.2);
 }

 .subsection-item {
   padding-left: 1.5rem;
 }

 .nav-icon {
   font-size: 1.1rem;
   flex-shrink: 0;
 }

 .nav-title {
   flex-grow: 1;
   text-align: left;
 }

 /* Financial Systems Guide Card */
 .financial-systems-guide-card {
   background: linear-gradient(135deg, #fad2e1 0%, #e9d8fd 100%);
   border-radius: 0.75rem;
   margin-bottom: 2rem;
   box-shadow: 0 4px 6px rgba(213, 63, 140, 0.1);
   border: 1px solid rgba(213, 63, 140, 0.2);
   overflow: visible !important;
   position: relative;
   z-index: 1;
 }

 .card-actions {
   display: flex;
   flex-wrap: wrap;
   gap: 0.75rem;
   align-items: center;
   position: relative;
   overflow: visible;
 }

 .financial-systems-guide-card .dropdown-menu {
   position: absolute;
   top: 100%;
   left: 0;
   z-index: 1001;
   min-width: 300px;
   max-width: 350px;
   overflow: visible;
   border: 1px solid rgba(213, 63, 140, 0.3);
   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
 }
 
 .card-content {
   display: flex;
   flex-wrap: wrap;
   padding: 1.5rem;
   align-items: center;
   gap: 1.5rem;
 }
 
 .card-icon {
   font-size: 2.5rem;
   color: var(--financial-primary);
   flex-shrink: 0;
 }
 
 .card-text {
   flex: 1;
   min-width: 200px;
 }
 
 .card-text h3 {
   margin: 0 0 0.5rem 0;
   color: var(--financial-primary);
   font-size: 1.25rem;
 }
 
 .card-text p {
   margin: 0;
   color: #4b5563;
   font-size: 1rem;
 }
 
 .primary-btn {
   background-color: var(--financial-primary);
   color: white;
   border: none;
   padding: 0.5rem 1rem;
   border-radius: 0.375rem;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.2s;
 }
 
 .primary-btn:hover {
   background-color: var(--financial-dark);
   transform: translateY(-1px);
 }
 
 .secondary-btn {
   background-color: white;
   color: var(--financial-primary);
   border: 1px solid var(--financial-primary);
   padding: 0.5rem 1rem;
   border-radius: 0.375rem;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.2s;
 }
 
 .secondary-btn:hover {
   background-color: var(--financial-light);
   transform: translateY(-1px);
 }
 
 .guide-navigation {
   display: flex;
   justify-content: space-between;
   margin-top: 3rem;
   padding-top: 1.5rem;
   border-top: 1px solid #e5e7eb;
 }

 .download-icon,
 .arrow-icon {
   display: inline-block;
   margin-left: 0.25rem;
 }

 /* Progress indicator */
 .progress-indicator {
   margin-bottom: 2rem;
   padding: 1rem;
   background: linear-gradient(90deg, rgba(213, 63, 140, 0.1), rgba(56, 161, 105, 0.1));
   border-radius: 0.5rem;
   border-left: 4px solid var(--financial-primary);
 }

 .progress-bar {
   width: 100%;
   height: 8px;
   background-color: #e5e7eb;
   border-radius: 4px;
   overflow: hidden;
   margin-bottom: 0.5rem;
 }

 .progress-fill {
   height: 100%;
   background: linear-gradient(90deg, var(--financial-primary), var(--financial-secondary));
   border-radius: 4px;
   transition: width 0.3s ease;
 }

 .progress-text {
   font-size: 0.875rem;
   color: var(--financial-primary);
   font-weight: 500;
 }

 /* Guide selector styles */
 .guide-selector {
   margin-bottom: 2rem;
   padding-bottom: 1rem;
   border-bottom: 1px solid #e5e7eb;
 }
 
 .guide-cards {
   display: flex;
   flex-wrap: wrap;
   gap: 1rem;
   margin-top: 1rem;
 }
 
 .guide-card {
   flex: 1;
   min-width: 200px;
   max-width: 300px;
   padding: 1.5rem;
   border-radius: 0.5rem;
   border: 1px solid #e5e7eb;
   cursor: pointer;
   transition: all 0.2s;
   display: flex;
   flex-direction: column;
   align-items: center;
   text-align: center;
 }
 
 .guide-card:hover {
   box-shadow: 0 4px 6px rgba(213, 63, 140, 0.1);
   transform: translateY(-2px);
   border-color: var(--financial-primary);
 }
 
 .guide-card.active {
   border-color: var(--financial-primary);
   background-color: var(--financial-light);
 }
 
 .guide-icon {
   font-size: 2rem;
   margin-bottom: 0.5rem;
 }
 
 .guide-title {
   font-weight: 600;
   margin-bottom: 0.5rem;
   color: var(--financial-primary);
 }
 
 .guide-desc {
   font-size: 0.875rem;
   color: #6b7280;
 }
 
 .guide-info {
   display: flex;
   flex-direction: column;
 }
 
 .dropdown {
   position: relative;
   display: inline-block;
 }

 .dropdown-toggle {
   display: flex;
   align-items: center;
   gap: 0.5rem;
   width: 100%;
 }

 .dropdown-menu {
   position: absolute;
   top: calc(100% + 4px);
   left: 0;
   z-index: 1001;
   min-width: 320px;
   max-width: 400px;
   padding: 0.5rem 0;
   background-color: #fff;
   border: 1px solid rgba(213, 63, 140, 0.3);
   border-radius: 0.375rem;
   box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
   white-space: normal;
   /* Default hidden state */
   visibility: hidden;
   opacity: 0;
   transform: translateY(-8px);
   transition: all 0.2s ease;
   pointer-events: none;
 }

 /* Show dropdown when open */
 .dropdown-menu.show {
   visibility: visible;
   opacity: 1;
   transform: translateY(0);
   pointer-events: auto;
 }

 .dropdown-item {
   display: flex;
   align-items: center;
   width: 100%;
   padding: 0.75rem 1.5rem;
   clear: both;
   font-weight: 400;
   color: #212529;
   text-align: inherit;
   white-space: normal !important;
   background-color: transparent;
   border: 0;
   cursor: pointer;
   transition: background-color 0.15s ease;
 }
 
 .dropdown-item:hover, 
 .dropdown-item:focus {
   color: #16181b;
   text-decoration: none;
   background-color: var(--financial-light);
 }

 /* For dropdown guide items */
 .dropdown-item .guide-icon {
   font-size: 1.5rem;
   margin-right: 1rem;
   margin-bottom: 0;
   display: inline-block;
   width: 24px;
   text-align: center;
   flex-shrink: 0;
 }
 
 .dropdown-item .guide-info {
   display: flex;
   flex-direction: column;
   flex: 1;
 }
 
 .dropdown-item .guide-title {
   font-weight: 600;
   margin-bottom: 0.25rem;
   color: var(--financial-primary);
 }
 
 .dropdown-item .guide-desc {
   font-size: 0.8rem;
   color: #6b7280;
   line-height: 1.3;
 }

 /* Section Navigation */
 .section-navigation {
   display: flex;
   justify-content: space-between;
   margin-top: 3rem;
   padding-top: 1.5rem;
   border-top: 1px solid #e5e7eb;
 }

 .nav-btn {
   background-color: var(--financial-primary);
   color: white;
   border: none;
   padding: 0.75rem 1.5rem;
   border-radius: 0.375rem;
   font-weight: 500;
   cursor: pointer;
   transition: all 0.2s;
 }

 .nav-btn:hover {
   background-color: var(--financial-dark);
   transform: translateY(-1px);
 }

 .prev-btn {
   margin-right: auto;
 }

 .next-btn {
   margin-left: auto;
 }

 /* Content styling */
 .content :global(h1) {
   font-size: 2rem;
   font-weight: 700;
   margin-bottom: 1.5rem;
   color: var(--financial-primary);
 }
 
 .content :global(h2) {
   font-size: 1.5rem;
   font-weight: 600;
   margin-top: 2rem;
   margin-bottom: 1rem;
   color: var(--financial-secondary);
 }
 
 .content :global(h3),
 :global(h4) {
   font-size: 1.25rem;
   font-weight: 600;
   margin-top: 1.5rem;
   margin-bottom: 0.75rem;
   color: var(--financial-accent);
 }

 :global(h4) {
   font-size: 1.2rem;
 }
 
 .content :global(p) {
   margin-bottom: 1rem;
   line-height: 1.7;
   color: #4b5563;
 }

 /* Lists - Hearts themed styling */
 .content :global(ul), 
 .content :global(ol) {
   margin: 1rem 0 1.5rem 0;
   padding-left: 1.5rem;
   color: #4b5563;
   line-height: 1.6;
 }

 /* Bullet Lists with Hearts */
 .content :global(ul) {
   list-style-type: none;
 }

 .content :global(ul li) {
   position: relative;
   margin-bottom: 0.5rem;
   padding-left: 1.25rem;
 }

 .content :global(ul li:not(.section-nav li))::before {
   content: "❤️";
   position: absolute;
   left: 0;
   top: 0;
   font-size: 0.8rem;
 }

 /* Nested bullet lists */
 .content :global(ul ul) {
   margin: 0.5rem 0;
   padding-left: 1.25rem;
 }

 .content :global(ul ul li::before) {
   content: "🍃";
   font-size: 0.8rem;
 }

 .content :global(ul ul ul li::before) {
   content: "💚";
   font-size: 0.8rem;
 }

 /* Numbered Lists */
 .content :global(ol) {
   list-style-type: decimal;
 }

 .content :global(ol li) {
   margin-bottom: 0.5rem;
   padding-left: 0.25rem;
 }

 /* Nested numbered lists */
 .content :global(ol ol) {
   margin: 0.5rem 0;
   padding-left: 1.25rem;
   list-style-type: lower-alpha;
 }

 .content :global(ol ol ol) {
   list-style-type: lower-roman;
 }

 /* Mixed nested lists */
 .content :global(ul ol), 
 .content :global(ol ul) {
   margin: 0.5rem 0;
   padding-left: 1.25rem;
 }

 /* List markers styling */
 .content :global(li::marker) {
   color: var(--financial-primary);
   font-weight: 500;
 }

 /* Better spacing for lists with paragraphs */
 .content :global(li p) {
   margin: 0.25rem 0;
 }

 .content :global(li p:first-child) {
   margin-top: 0;
 }

 .content :global(li p:last-child) {
   margin-bottom: 0;
 }

 /* Blockquotes */
 :global(blockquote) {
   background-color: #fad2e1;
   border-left: 4px solid var(--financial-primary);
   padding: 1rem 1.5rem;
   margin: 1.5rem 0;
   border-radius: 0.5rem;
 }

 :global(blockquote > p:first-child strong) {
   font-size: 1.1rem;
   color: var(--financial-primary);
   display: block;
   margin-bottom: 0.75rem;
 }

 :global(blockquote ul),
 :global(blockquote ol) {
   margin-left: 0;
   margin-top: 0.75rem;
   margin-bottom: 0.75rem;
 }

 :global(blockquote li) {
   margin-bottom: 0.5rem;
 }

 :global(blockquote p:last-child) {
   margin-top: 0.75rem;
   font-style: italic;
 }

 :global(blockquote a) {
   color: var(--financial-primary);
   text-decoration: underline;
   font-weight: 500;
 }

 :global(blockquote a:hover) {
   color: var(--financial-dark);
 }

 /* Tables */
 :global(.content table) {
   width: 100%;
   border-collapse: collapse;
   margin: 1.5rem 0;
   font-size: 0.95rem;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
   border-radius: 0.375rem;
   overflow: hidden;
 }

 :global(.content thead) {
   background: linear-gradient(to right, var(--financial-primary), var(--financial-secondary));
 }

 :global(.content th) {
   padding: 0.75rem 1rem;
   font-weight: 600;
   text-align: left;
   color: #ffffff;
   border: none;
   border-bottom: 2px solid var(--financial-primary);
 }

 :global(.content td) {
   padding: 0.75rem 1rem;
   border: 1px solid #e5e7eb;
   border-left: none;
   border-right: none;
   vertical-align: top;
 }

 :global(.content tr:nth-child(odd)) {
   background-color: #faf5ff;
 }

 :global(.content tr:nth-child(even)) {
   background-color: #ffffff;
 }

 :global(.content tr:hover) {
   background-color: var(--financial-light);
 }

 :global(.content tbody tr:last-child td) {
   border-bottom: none;
 }

 :global(.content table caption),
 :global(.content table tfoot) {
   background-color: var(--financial-light);
   padding: 0.75rem;
   font-size: 0.875rem;
   color: var(--financial-primary);
   text-align: left;
   border-top: 1px solid var(--financial-primary);
 }

 :global(.content td.highlight) {
   color: var(--financial-primary);
   font-weight: 600;
 }

 /* Links */
 .content :global(a) {
   color: var(--financial-primary);
   text-decoration: underline;
   font-weight: 500;
   transition: all 0.2s;
 }

 .content :global(a:hover) {
   color: var(--financial-dark);
   text-decoration: underline;
 }

 .content :global(a:active) {
   color: var(--financial-dark);
 }

 .content :global(a[href^="http"]):after, 
 .content :global(a[href^="https://"]):after {
   content: " ↗";
   font-size: 0.8em;
   vertical-align: super;
 }

 .content :global(a[href$=".pdf"]):after {
   content: " ↓";
   font-size: 0.8em;
 }

 /* Language fallback notice */
 .language-fallback-notice {
   display: flex;
   align-items: flex-start;
   gap: 1rem;
   background-color: rgba(56, 161, 105, 0.1);
   border: 1px solid rgba(56, 161, 105, 0.3);
   border-radius: 0.5rem;
   padding: 1rem 1.25rem;
   margin-bottom: 1.5rem;
 }

 .notice-icon {
   font-size: 1.25rem;
   color: var(--financial-secondary);
   flex-shrink: 0;
   margin-top: 0.125rem;
 }

 .notice-content {
   flex: 1;
 }

 .notice-content strong {
   color: var(--financial-secondary);
   font-size: 0.95rem;
   display: block;
   margin-bottom: 0.25rem;
 }

 .notice-content p {
   color: #4b5563;
   font-size: 0.875rem;
   margin: 0;
   line-height: 1.5;
 }

 /* Loading state */
 .loading-container {
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   min-height: 400px;
   text-align: center;
 }

 .loading-spinner {
   width: 3rem;
   height: 3rem;
   border: 3px solid var(--financial-light);
   border-top: 3px solid var(--financial-primary);
   border-radius: 50%;
   animation: spin 1s linear infinite;
   margin-bottom: 1rem;
 }

 @keyframes spin {
   0% { transform: rotate(0deg); }
   100% { transform: rotate(360deg); }
 }

 /* Missing section styling */
 .missing-section {
   text-align: center;
   padding: 3rem 2rem;
   background-color: #fef2f2;
   border: 1px solid #fecaca;
   border-radius: 0.5rem;
   margin: 2rem 0;
 }

 .missing-section h2 {
   color: var(--financial-primary);
   margin-bottom: 1rem;
 }

 .missing-section p {
   color: #6b7280;
   margin-bottom: 2rem;
 }

 /* Responsive Design */
 @media (max-width: 768px) {
   .documentation-container {
     grid-template-columns: 1fr;
   }

   .section-nav {
     padding: 0.75rem;
   }

   .accordion-header {
     padding: 0.5rem 0.75rem;
     font-size: 0.9rem;
   }

   .nav-item {
     padding: 0.5rem 0.75rem;
     font-size: 0.85rem;
   }

   .subsection-item {
     padding-left: 1rem;
   }

   .card-content {
     flex-direction: column;
     align-items: flex-start;
     gap: 1rem;
   }
   
   .card-actions {
     width: 100%;
     justify-content: center;
   }
   
   .guide-navigation {
     flex-direction: column;
     gap: 1rem;
   }
   
   .guide-navigation button {
     width: 100%;
   }
   
   .guide-cards {
     flex-direction: column;
   }
   
   .guide-card {
     max-width: none;
   }

   .section-navigation {
     flex-direction: column;
     gap: 1rem;
   }

   .nav-btn {
     width: 100%;
     margin: 0 !important;
   }
 }

 @media (max-width: 640px) {
   .language-fallback-notice {
     padding: 0.75rem 1rem;
   }
   
   .notice-icon {
     font-size: 1.1rem;
   }
   
   .notice-content strong {
     font-size: 0.9rem;
   }
   
   .notice-content p {
     font-size: 0.8rem;
   }
 }

 .arrow-icon {
   display: inline-block;
   margin-left: 0.25rem;
   transition: transform 0.2s ease;
 }

 .arrow-icon.rotated {
   transform: rotate(180deg);
 }

 html {
   scroll-behavior: smooth;
 }

 #main-content {
   scroll-margin-top: 2rem;
 }

 .section-content {
   scroll-margin-top: 2rem;
 }

 .content {
   scroll-margin-top: 2rem;
   position: relative;
 }
</style>
