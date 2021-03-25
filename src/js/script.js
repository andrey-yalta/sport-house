// // при нажатии на мобильный навбар открывать обычный навбар
const navBarLogo = document.querySelector("#navbar-mobile__logo")
navBarLogo.addEventListener("click", ()=>{
    document.querySelector("#navbar").classList.toggle("show_navbar")
})



const slilderImgClasses =["three__back-1","three__back-2","three__back-3","three__back-4"]
// функция для прокрутки слайдера
function slider(imgId,clickImgClass){
    document.querySelector(imgId).addEventListener("click", ()=>{
        // при нажатии на кнопку слайдера у блока картинки удаляется текущий класс и добавляется класс требуемый
        document.querySelector("#three-img")
            .classList.remove(...slilderImgClasses.filter(u=>u!==clickImgClass)) // убирает из списка удаляемых блоков тот, на который нажали
        document.querySelector("#three-img")
            .classList.add(clickImgClass) // добавляет блоку картинки требуемый класс изображения

    })
}
slider("#first-img","three__back-1"); //прописываем функцию слайдера каждой ссылке на картинку
slider("#second-img","three__back-2");
slider("#third-img","three__back-3");
slider("#four-img","three__back-4");



const animItems = document.querySelectorAll("._animItems"); // создаем массив всх анимируемых элементов
if(animItems.length> 0){ //если массив аним. элементов не равен 0, то начинаем функцию
    window.addEventListener('scroll', animScroll) // создаем слушатель скрола
    function animScroll() {
        for(let i =0; i<animItems.length; i++){ // для каждого анимируемого элемента

            const animItem =animItems[i]; // берем текущий элемент
            const animItemHeight = animItem.offsetHeight; // высота текущего элемента
            const animItemOffset = offset(animItem).top; //верхушка элемента
            const animStart = 4; //индекс
            let animItemPoint = window.innerHeight - animItemHeight / animStart; // точка,с которой будет включатся анимация

            if(animItemHeight > window.innerHeight){ //если анимируемый элемент выше чем область экрана
                animItemPoint = window.innerHeight - window.innerHeight / animStart;
            }
            if((pageYOffset > animItemOffset - animItemPoint) && pageYOffset <(animItemOffset +animItemHeight)){
                animItem.classList.add('_active'); //если текущее положение скрола ниже чем точка анимирования добавляем класс
            }
            else {
                if(animItem.classList.contains("_anim__noHide")){// когда мы прошли анимируемый элемент и у него есть класс hide, тогда удаляем класс видимости и он будет опять появлятся
                    animItem.classList.remove("_active");
                }

            }

        }
    }
    function offset(el) {
        //функция  определени элемента ?
        const rect =el.getBoundingClientRect()
          scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
          scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        return{ top: rect.top + scrollTop, left:rect.left + scrollLeft}
    }
    animScroll();
}
