import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './style.css';
import { quizCategories } from './questions.js';
import { Quiz } from './quiz.js';

// Khởi tạo thống kê
let statistics = { visit_count: 0, quiz_attempts: 0 };

// Cập nhật thống kê từ Supabase
async function updateStatistics() {
  // Tăng số lượt truy cập
  await incrementVisitCount();

  // Lấy thống kê mới nhất
  statistics = await getStatistics();

  // Cập nhật UI
  updateStatisticsUI();
}

// Cập nhật UI thống kê
function updateStatisticsUI() {
  const visitCountElement = document.getElementById('visit-count');
  const quizAttemptsElement = document.getElementById('quiz-attempts');

  if (visitCountElement) {
    visitCountElement.textContent = statistics.visit_count;
  }
  if (quizAttemptsElement) {
    quizAttemptsElement.textContent = statistics.quiz_attempts;
  }
}

// Sử dụng Document Fragment để tối ưu hiệu năng DOM
const template = document.createElement('template');
template.innerHTML = `
  <div class="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100">
    <!-- Navigation Bar -->
    <nav class="bg-white shadow-lg">
      <div class="max-w-6xl mx-auto px-4">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center py-3 md:py-0">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-3 cursor-pointer" id="home-btn">
              <svg class="h-6 w-6 md:h-8 md:w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
              </svg>
              <span class="text-lg md:text-xl font-bold text-gray-800">Trắc Nghiệm Kiến Thức</span>
            </div>
            <button id="mobile-menu-button" class="md:hidden rounded-lg focus:outline-none focus:shadow-outline">
              <svg fill="currentColor" viewBox="0 0 20 20" class="w-6 h-6">
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd"></path>
              </svg>
            </button>
          </div>
          <div id="mobile-menu" class="hidden md:flex flex-col md:flex-row md:items-center md:space-x-6 w-full md:w-auto mt-4 md:mt-0">
            <button id="search-btn" class="block px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium">
              Tra Cứu Câu Hỏi
            </button>
            <button id="quiz-nav-btn" class="block px-4 py-2 text-indigo-600 hover:text-indigo-800 font-medium">
              Làm Bài Kiểm Tra
            </button>
            <span id="timer" class="block px-4 py-2 text-gray-600 font-semibold"></span>
          </div>
        </div>
      </div>
    </nav>

    <!-- Home Section -->
    <div id="home-section" class="py-8 md:py-12 px-4">
      <div class="max-w-6xl mx-auto">
        <!-- Hero Section -->
        <div class="text-center mb-12 md:mb-16">
          <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Chào Mừng Đến Với Hệ Thống Trắc Nghiệm
          </h1>
          <p class="text-lg md:text-xl text-gray-600 mb-6 md:mb-8">
            Hệ thống trắc nghiệm trực tuyến giúp bạn kiểm tra và nâng cao kiến thức
          </p>
          <div class="flex flex-col sm:flex-row justify-center gap-4">
            <button id="start-quiz-btn" class="w-full sm:w-auto bg-indigo-600 text-white px-6 md:px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
              Bắt Đầu Làm Bài
            </button>
            <button id="start-search-btn" class="w-full sm:w-auto bg-white text-indigo-600 px-6 md:px-8 py-3 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors font-medium">
              Tra Cứu Đáp Án
            </button>
          </div>
        </div>

        <!-- Features Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
          <div class="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
            <div class="text-indigo-600 mb-4">
              <svg class="w-10 h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-semibold mb-2">9 Bộ Đề Thi</h3>
            <p class="text-gray-600">Đa dạng chủ đề và mức độ, giúp bạn ôn tập toàn diện</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
            <div class="text-indigo-600 mb-4">
              <svg class="w-10 h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-semibold mb-2">Tra Cứu Nhanh</h3>
            <p class="text-gray-600">Tìm kiếm câu hỏi và đáp án một cách dễ dàng</p>
          </div>
          <div class="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform">
            <div class="text-indigo-600 mb-4">
              <svg class="w-10 h-10 md:w-12 md:h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-lg md:text-xl font-semibold mb-2">Kết Quả Chi Tiết</h3>
            <p class="text-gray-600">Thống kê điểm số và xem lại đáp án chi tiết</p>
          </div>
        </div>

        <!-- Quick Stats -->
        <div class="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h2 class="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8">Thống Kê Tổng Quan</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">${
                quizCategories.length
              }</div>
              <div class="text-gray-600">Bộ Đề Thi</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">
                ${quizCategories.reduce(
                  (total, cat) => total + cat.questions.length,
                  0
                )}
              </div>
              <div class="text-gray-600">Câu Hỏi</div>
            </div>
            <div class="text-center">
              <div id="visit-count" class="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">0</div>
              <div class="text-gray-600">Lượt Truy Cập</div>
            </div>
            <div class="text-center">
              <div id="quiz-attempts" class="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">0</div>
              <div class="text-gray-600">Lượt Làm Bài</div>
            </div>
            <div class="text-center">
              <div class="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">100%</div>
              <div class="text-gray-600">Miễn Phí</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Search Section -->
    <div id="search-section" class="py-6 md:py-8 px-4 max-w-6xl mx-auto hidden">
      <div class="bg-white rounded-xl shadow-lg p-6 md:p-8">
        <div class="mb-6">
          <input 
            type="text" 
            id="search-input" 
            placeholder="Nhập từ khóa để tìm kiếm câu hỏi..." 
            class="w-full px-4 py-2 text-base md:text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
        </div>
        <div id="search-results" class="space-y-4 md:space-y-6">
          <!-- Search results will be populated here -->
        </div>
      </div>
    </div>

    <!-- Quiz Categories Section -->
    <div id="categories-section" class="py-6 md:py-8 px-4 max-w-6xl mx-auto hidden">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        ${quizCategories
          .map(
            (category) => `
          <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all transform hover:scale-105 cursor-pointer quiz-category" data-category-id="${category.id}">
            <div class="h-32 md:h-40 bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
              <h3 class="text-xl md:text-2xl font-bold text-white">Bài ${category.id}</h3>
            </div>
            <div class="p-4 md:p-6">
              <h4 class="text-lg md:text-xl font-bold text-gray-800 mb-2">${category.title}</h4>
              <p class="text-sm md:text-base text-gray-600">${category.description}</p>
              <p class="text-xs md:text-sm text-gray-500 mt-2">${category.questions.length} câu hỏi</p>
            </div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>

    <!-- Quiz Section -->
    <div id="quiz-section" class="py-6 md:py-8 px-4 hidden">
      <div class="max-w-2xl mx-auto">
        <div class="bg-white rounded-xl shadow-lg p-4 md:p-8">
          <div class="text-center mb-6 md:mb-8">
            <h1 id="quiz-title" class="text-2xl md:text-3xl font-bold text-indigo-600">Bài Kiểm Tra Trắc Nghiệm</h1>
            <p class="text-sm md:text-base text-gray-600 mt-2">Hãy chọn câu trả lời đúng cho mỗi câu hỏi</p>
          </div>
          
          <div id="quiz-container">
            <div id="question-container" class="mb-4 md:mb-6"></div>
            <div id="options-container" class="space-y-2 md:space-y-3 mb-4 md:mb-6"></div>
            <div class="flex justify-between items-center text-sm md:text-base">
              <div id="progress" class="text-gray-600"></div>
              <div id="score" class="text-gray-600"></div>
            </div>
            <div class="mt-4 md:mt-6 flex justify-center">
              <button id="next-btn" class="w-full md:w-auto bg-indigo-600 text-white px-6 md:px-8 py-2 md:py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                Câu Tiếp Theo
              </button>
            </div>
          </div>

          <div id="results" class="hidden">
            <h2 class="text-xl md:text-2xl font-bold text-indigo-600 mb-4 text-center">Kết Quả Của Bạn</h2>
            <p id="final-score" class="text-lg md:text-xl mb-6 text-center"></p>
            <div id="answer-review" class="space-y-4 md:space-y-6 mb-6 md:mb-8"></div>
            <div class="flex flex-col sm:flex-row justify-center gap-4">
              <button id="restart-btn" class="w-full sm:w-auto bg-indigo-600 text-white px-4 md:px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                Làm Lại Bài Kiểm Tra
              </button>
              <button id="categories-btn" class="w-full sm:w-auto bg-white text-indigo-600 px-4 md:px-6 py-2 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors">
                Chọn Bài Khác
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
`;

// Sử dụng document fragment để tối ưu hiệu năng
document.querySelector('#app').appendChild(template.content.cloneNode(true));

// Initialize quiz and handle navigation
let currentQuiz = null;
const homeSection = document.getElementById('home-section');
const searchSection = document.getElementById('search-section');
const categoriesSection = document.getElementById('categories-section');
const quizSection = document.getElementById('quiz-section');
const homeBtn = document.getElementById('home-btn');
const searchBtn = document.getElementById('search-btn');
const quizNavBtn = document.getElementById('quiz-nav-btn');
const categoriesBtn = document.getElementById('categories-btn');
const startQuizBtn = document.getElementById('start-quiz-btn');
const startSearchBtn = document.getElementById('start-search-btn');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

// Debounce function để tối ưu hiệu năng search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Toggle mobile menu
mobileMenuButton.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.add('hidden');
  }
});

function showHomeSection() {
  homeSection.classList.remove('hidden');
  searchSection.classList.add('hidden');
  categoriesSection.classList.add('hidden');
  quizSection.classList.add('hidden');
  mobileMenu.classList.add('hidden');
}

function showSearchSection() {
  homeSection.classList.add('hidden');
  searchSection.classList.remove('hidden');
  categoriesSection.classList.add('hidden');
  quizSection.classList.add('hidden');
  mobileMenu.classList.add('hidden');
}

function showCategoriesSection() {
  homeSection.classList.add('hidden');
  searchSection.classList.add('hidden');
  categoriesSection.classList.remove('hidden');
  quizSection.classList.add('hidden');
  mobileMenu.classList.add('hidden');
}

async function showQuizSection(categoryId) {
  const category = quizCategories.find((cat) => cat.id === categoryId);
  if (!category) return;

  document.getElementById(
    'quiz-title'
  ).textContent = `Bài ${category.id}: ${category.title}`;

  homeSection.classList.add('hidden');
  searchSection.classList.add('hidden');
  categoriesSection.classList.add('hidden');
  quizSection.classList.remove('hidden');
  mobileMenu.classList.add('hidden');

  currentQuiz = new Quiz(category.questions);
  currentQuiz.init();

  // Tăng số lượt làm bài và cập nhật thống kê
  await incrementQuizAttempts();
  statistics = await getStatistics();
  updateStatisticsUI();
}

// Tối ưu hàm search với debounce
const searchQuestions = debounce((query) => {
  if (!query) {
    searchResults.innerHTML =
      '<p class="text-gray-500 text-center">Nhập từ khóa để tìm kiếm câu hỏi...</p>';
    return;
  }

  const results = [];
  const queryLower = query.toLowerCase();

  quizCategories.forEach((category) => {
    category.questions.forEach((question) => {
      if (question.question.toLowerCase().includes(queryLower)) {
        results.push({
          categoryId: category.id,
          categoryTitle: category.title,
          ...question,
        });
      }
    });
  });

  if (results.length === 0) {
    searchResults.innerHTML =
      '<p class="text-gray-500 text-center">Không tìm thấy câu hỏi phù hợp</p>';
    return;
  }

  const fragment = document.createDocumentFragment();
  results.forEach((result) => {
    const div = document.createElement('div');
    div.className = 'bg-gray-50 rounded-lg p-4 md:p-6 animate-fade-in';
    div.innerHTML = `
      <div class="flex items-start justify-between">
        <h3 class="text-base md:text-lg font-semibold text-gray-800 mb-2">Bài ${
          result.categoryId
        }: ${result.categoryTitle}</h3>
      </div>
      <p class="text-sm md:text-base text-gray-700 mb-4">${result.question}</p>
      <div class="space-y-2">
        ${result.options
          .map(
            (option, index) => `
          <div class="flex items-center">
            <div class="w-5 h-5 md:w-6 md:h-6 flex items-center justify-center ${
              index === result.correctAnswer
                ? 'bg-green-100 text-green-800 border border-green-500'
                : 'bg-gray-100 text-gray-500 border border-gray-300'
            } rounded-full mr-2">
              ${index === result.correctAnswer ? '✓' : index + 1}
            </div>
            <span class="text-sm md:text-base ${
              index === result.correctAnswer
                ? 'text-green-800 font-medium'
                : 'text-gray-600'
            }">${option}</span>
          </div>
        `
          )
          .join('')}
      </div>
    `;
    fragment.appendChild(div);
  });

  searchResults.innerHTML = '';
  searchResults.appendChild(fragment);
}, 300);

// Add event listeners
homeBtn.addEventListener('click', showHomeSection);
searchBtn.addEventListener('click', showSearchSection);
quizNavBtn.addEventListener('click', showCategoriesSection);
categoriesBtn?.addEventListener('click', showCategoriesSection);
startQuizBtn.addEventListener('click', showCategoriesSection);
startSearchBtn.addEventListener('click', showSearchSection);

// Add search input handler with debounce
searchInput.addEventListener('input', (e) => {
  searchQuestions(e.target.value);
});

// Add click handlers for quiz categories using event delegation
categoriesSection.addEventListener('click', (e) => {
  const categoryElement = e.target.closest('.quiz-category');
  if (categoryElement) {
    const categoryId = parseInt(categoryElement.dataset.categoryId);
    showQuizSection(categoryId);
  }
});

// Show home section by default
showHomeSection();

// Khởi tạo thống kê khi trang web được tải
updateStatistics();