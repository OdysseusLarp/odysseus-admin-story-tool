import { animateScroll, scroller } from "react-scroll";

const scrollOptions = { duration: 150 };

export default function FloatingButtons() {

    const scrollToTop = () => {
        animateScroll.scrollToTop(scrollOptions);
    }

    const scrollToAppTitle = () => {
        scroller.scrollTo("app-title", scrollOptions)
    }

    return (
        <div className="floating-button-container">
            <button type="button" onClick={scrollToTop}>To the top!</button>
            <button type="button" onClick={scrollToAppTitle}>To app title</button>
        </div>
    )
}