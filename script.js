document.addEventListener('DOMContentLoaded', () => {
    const searchBox = document.getElementById('search-box');
    const searchBtn = document.getElementById('search-btn');
    const randomBtn = document.getElementById('random-btn');
    const results = document.getElementById('results');
    const pagination = document.getElementById('pagination');
    const toggleThemeBtn = document.getElementById('toggle-theme');
    const loading = document.getElementById('loading');
  
    const baseUrl = 'https://en.wikipedia.org/w/api.php?origin=*';
    const searchEndpoint = `${baseUrl}&action=query&list=search&format=json&srsearch=`;
    const randomEndpoint = `${baseUrl}&action=query&list=random&rnnamespace=0&format=json`;
    const suggestionEndpoint = `${baseUrl}&action=opensearch&format=json&search=`;
  
    let currentPage = 1;
    let searchTerm = '';
  
    const fetchResults = async (query, page = 1) => {
      loading.style.display = 'block';
      const response = await fetch(`${searchEndpoint}${query}&sroffset=${(page - 1) * 10}`);
      const data = await response.json();
      loading.style.display = 'none';
      return data.query.search;
    };
  
    const renderResults = (data) => {
      results.innerHTML = '';
      data.forEach(item => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result';
        resultItem.innerHTML = `
          <h3>${item.title}</h3>
          <p>${item.snippet}</p>
          <a href="https://en.wikipedia.org/?curid=${item.pageid}" target="_blank">Read more</a>
        `;
        results.appendChild(resultItem);
      });
    };
  
    const updatePagination = (page) => {
      pagination.innerHTML = '';
      if (page > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = 'Previous';
        prevBtn.addEventListener('click', () => {
          currentPage -= 1;
          handleSearch();
        });
        pagination.appendChild(prevBtn);
      }
      if (results.childElementCount === 10) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = 'Next';
        nextBtn.addEventListener('click', () => {
          currentPage += 1;
          handleSearch();
        });
        pagination.appendChild(nextBtn);
      }
    };
  
    const handleSearch = async () => {
      const query = searchBox.value.trim();
      if (!query) return;
      searchTerm = query;
      const data = await fetchResults(query, currentPage);
      renderResults(data);
      updatePagination(currentPage);
    };
  
    const fetchRandomArticle = async () => {
      const response = await fetch(randomEndpoint);
      const data = await response.json();
      const article = data.query.random[0];
      window.open(`https://en.wikipedia.org/?curid=${article.id}`, '_blank');
    };
  
    const showSuggestions = async (query) => {
      if (!query) {
        document.getElementById('suggestions').innerHTML = '';
        return;
      }
      const response = await fetch(`${suggestionEndpoint}${query}`);
      const data = await response.json();
      const suggestions = data[1];
      document.getElementById('suggestions').innerHTML = suggestions
        .map(suggestion => `<div class="suggestion">${suggestion}</div>`)
        .join('');
    };
  
    searchBtn.addEventListener('click', handleSearch);
    randomBtn.addEventListener('click', fetchRandomArticle);
  
    toggleThemeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      document.body.classList.toggle('light-mode');
      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
      } else {
        localStorage.setItem('theme', 'light');
      }
    });
  
    document.addEventListener('DOMContentLoaded', () => {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        document.body.classList.add(savedTheme + '-mode');
      } else {
        document.body.classList.add('light-mode');
      }
    });
  });
  