import { animateScroll, scroller } from "react-scroll";
import { Button, ButtonGroup } from "react-bootstrap";
import { MdOutlineMilitaryTech, MdOutlinePerson, MdOutlineMedicalServices } from "react-icons/md";
import { BiArrowToTop, BiArrowToBottom } from "react-icons/bi";

import './FloatingButtons.css';

const scrollOptions = { duration: 150 };

export default function FloatingButtons() {

  const scrollToTop = () => {
    animateScroll.scrollToTop(scrollOptions);
  }

  const scrollToBottom = () => {
    animateScroll.scrollToBottom(scrollOptions);
  }

  const scrollToTitle = (title) => {
    scroller.scrollTo(title, scrollOptions)
  }

  return (
    <div className="floating-button-container">
      <ButtonGroup>
        <Button className="float-char-btn" variant="outline-secondary" onClick={scrollToTop}><BiArrowToTop size="25px"/></Button>
        <Button className="float-char-btn" variant="outline-secondary" onClick={() => scrollToTitle("personal")}><MdOutlinePerson size="25px"/></Button>
        <Button className="float-char-btn" variant="outline-secondary" onClick={() => scrollToTitle("military")}><MdOutlineMilitaryTech size="25px"/></Button>
        <Button className="float-char-btn" variant="outline-secondary" onClick={() => scrollToTitle("medical")}><MdOutlineMedicalServices size="25px"/></Button>
        <Button className="float-char-btn" variant="outline-secondary" onClick={scrollToBottom}><BiArrowToBottom size="25px"/></Button>
      </ButtonGroup>
    </div>
  )
}