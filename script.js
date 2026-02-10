// Technical Art Portfolio - 交互脚本

document.addEventListener('DOMContentLoaded', () => {
    // 初始化所有功能
    initNavigation();
    initPortfolioFilter();
    initScrollAnimations();
    initSmoothScroll();
    initContactForm();
    initMobileMenu();
    initVideoModal();
});

// ========================================
// 导航栏功能
// ========================================
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    // 滚动时改变导航栏样式
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // 添加/移除滚动样式
        if (currentScroll > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
            navbar.style.boxShadow = 'none';
        }
        
        // 更新活动链接
        updateActiveNavLink();
        
        lastScroll = currentScroll;
    });
    
    // 更新活动导航链接
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.pageYOffset + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// ========================================
// 作品筛选功能
// ========================================
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // 更新按钮状态
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            // 筛选作品
            portfolioItems.forEach((item, index) => {
                const category = item.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    // 显示项目
                    item.classList.remove('hidden');
                    item.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
                    item.style.opacity = '0';
                } else {
                    // 隐藏项目
                    item.classList.add('hidden');
                }
            });
        });
    });
    
    // 初始化动画
    portfolioItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.animation = `fadeIn 0.5s ease ${index * 0.1}s forwards`;
    });
}

// ========================================
// 滚动动画
// ========================================
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // 观察需要动画的元素
    const animateElements = document.querySelectorAll(
        '.contact-info'
    );
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

// ========================================
// 平滑滚动
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// 联系表单
// ========================================
function initContactForm() {
    const form = document.querySelector('.contact-form');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // 获取表单数据
            const formData = new FormData(form);
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // 简单的表单验证
            if (!name || !email || !message) {
                showNotification('请填写所有必填字段', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('请输入有效的邮箱地址', 'error');
                return;
            }
            
            // 模拟发送成功
            showNotification('消息已发送！我会尽快回复您。', 'success');
            form.reset();
        });
    }
}

// 邮箱验证
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
        </div>
    `;
    
    // 添加样式
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(244, 63, 94, 0.9)' : 'rgba(139, 92, 246, 0.9)'};
        color: white;
        border-radius: 12px;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(120%);
        transition: transform 0.3s ease;
        backdrop-filter: blur(10px);
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // 显示动画
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // 自动隐藏
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// ========================================
// 移动端菜单
// ========================================
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // 切换菜单动画
            const spans = menuBtn.querySelectorAll('span');
            if (menuBtn.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
        
        // 点击链接后关闭菜单
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                navLinks.classList.remove('active');
                
                const spans = menuBtn.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

// ========================================
// 视差效果
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.gradient-orb');
    
    parallaxElements.forEach((el, index) => {
        const speed = 0.5 + (index * 0.1);
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ========================================
// 鼠标跟随效果（英雄区域）
// ========================================
const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const orbs = document.querySelectorAll('.gradient-orb');
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        orbs.forEach((orb, index) => {
            const speed = (index + 1) * 20;
            const xOffset = (x - 0.5) * speed;
            const yOffset = (y - 0.5) * speed;
            
            orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
        });
    });
}

// ========================================
// 作品项点击效果
// ========================================
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('click', () => {
        const title = item.querySelector('.item-title').textContent;
        showNotification(`正在查看: ${title}`, 'info');
    });
});

// ========================================
// 技能卡片悬停效果增强
// ========================================
document.querySelectorAll('.skill-category').forEach(skill => {
    skill.addEventListener('mouseenter', () => {
        skill.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    skill.addEventListener('mouseleave', () => {
        skill.style.transform = 'translateY(0) scale(1)';
    });
});

// ========================================
// 打字机效果（可选）
// ========================================
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// 页面加载完成后执行打字机效果
window.addEventListener('load', () => {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const originalText = heroSubtitle.textContent;
        typeWriter(heroSubtitle, originalText, 50);
    }
});

// ========================================
// 视频模态框功能
// ========================================
function initVideoModal() {
    const modal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    const modalTitle = document.getElementById('modalTitle');
    const modalDesc = document.getElementById('modalDesc');
    const modalClose = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    // 为所有查看详情按钮添加点击事件
    document.querySelectorAll('.portfolio-item').forEach(item => {
        const viewBtn = item.querySelector('.view-btn');
        const video = item.querySelector('video');
        const titleEl = item.querySelector('.item-title');
        const descEl = item.querySelector('.item-desc');
        const title = titleEl ? titleEl.textContent : '作品';
        const desc = descEl ? descEl.textContent : '';
        
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                // 如果有视频，打开模态框
                if (video) {
                    const videoSrc = video.querySelector('source').src;
                    modalVideo.querySelector('source').src = videoSrc;
                    modalVideo.load();
                    modalTitle.textContent = title;
                    modalDesc.textContent = desc;
                    modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    
                    // 自动播放
                    modalVideo.play().catch(err => {
                        console.log('自动播放被阻止:', err);
                    });
                } else {
                    // 非视频作品显示提示
                    showNotification(`查看作品: ${title}`, 'info');
                }
            });
        }
    });
    
    // 关闭模态框
    function closeModal() {
        modal.classList.remove('active');
        modalVideo.pause();
        modalVideo.currentTime = 0;
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    // ESC键关闭
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

// ========================================
// 复制邮箱功能
// ========================================
function copyEmail() {
    const email = '1758972636@qq.com';
    
    // 创建临时输入框
    const tempInput = document.createElement('input');
    tempInput.value = email;
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    
    // 选择并复制
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        showNotification('邮箱已复制到剪贴板！', 'success');
        
        // 更改按钮状态
        const copyBtn = document.querySelector('.email-copy-wrapper .copy-btn');
        const originalText = copyBtn.querySelector('.copy-tooltip').textContent;
        copyBtn.classList.add('copied');
        copyBtn.querySelector('.copy-tooltip').textContent = '已复制';
        
        // 2秒后恢复
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.querySelector('.copy-tooltip').textContent = originalText;
        }, 2000);
        
    } catch (err) {
        showNotification('复制失败，请手动复制', 'error');
    }
    
    // 移除临时输入框
    document.body.removeChild(tempInput);
}

// ========================================
// 复制百度网盘链接功能
// ========================================
function copyBaiduLink() {
    const baiduUrl = '通过网盘分享的文件：命运请等待Demo链接: https://pan.baidu.com/s/1V5rqULloIiLVQ8TBfju5Pg?pwd=u8mv 提取码: u8mv --来自百度网盘超级会员v5的分享';
    
    // 创建临时输入框
    const tempInput = document.createElement('input');
    tempInput.value = baiduUrl;
    tempInput.style.position = 'absolute';
    tempInput.style.left = '-9999px';
    document.body.appendChild(tempInput);
    
    // 选择并复制
    tempInput.select();
    tempInput.setSelectionRange(0, 99999);
    
    try {
        document.execCommand('copy');
        showNotification('百度网盘链接已复制到剪贴板！', 'success');
        
        // 更改按钮状态
        const copyBtn = document.querySelector('.game-download .copy-btn');
        const originalText = copyBtn.querySelector('.copy-tooltip').textContent;
        copyBtn.classList.add('copied');
        copyBtn.querySelector('.copy-tooltip').textContent = '已复制';
        
        // 2秒后恢复
        setTimeout(() => {
            copyBtn.classList.remove('copied');
            copyBtn.querySelector('.copy-tooltip').textContent = originalText;
        }, 2000);
        
    } catch (err) {
        showNotification('复制失败，请手动复制', 'error');
    }
    
    // 移除临时输入框
    document.body.removeChild(tempInput);
}
