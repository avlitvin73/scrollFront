import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import bg from '../public/img/ground.webp'
import { useState, useEffect, useRef } from "react";
import axios from 'axios';


const joinClasses = (...classes: string[]) => {
  return classes.map((className) => styles[className]).join(" ");
};

const encrypt = (text, key) => {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    let char = text.charCodeAt(i);
    let keychar = key.charCodeAt(i % key.length);
    result += String.fromCharCode(char ^ keychar);
  }
  return result;
}

const Home: NextPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [data, setData] = useState([])
  const [scroll, setScroll] = useState(0)
  const [direction, setDirection] = useState(true)
  const scrollSection = useRef<HTMLDivElement>()
  const name = useRef<string>()

  useEffect(() => {
    if (!name.current) name.current = prompt('Enter your name: ')
    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousedown', handleMiddle)
    window.addEventListener('keydown', handleKeys)
    window.scrollTo(0, 0)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousedown', handleMiddle)
      window.removeEventListener('keydown', handleKeys)
    }
  }, [])

  const getData = async () => {
    const crypted = encrypt(`${name.current}&${scroll}`, 'key')
    const req = await axios.post('https://scrollRank.aleksandrlitvin.repl.co', {
      name: `${name.current}`,
      scroll: crypted || 0
    })
    const newData = await req.data;
    return setData([...newData]);
  };

  const handleMiddle = (event) => {
    if (event.button === 1) event.preventDefault()
  }

  const handleKeys = (event) => {
    const keysToDisable = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' '];
    if (keysToDisable.includes(event.key)) event.preventDefault()
  }

  const handleScroll = (event) => {

    setScroll((prev) => ++prev)
    if (window.pageYOffset > scrollSection.current.clientHeight / 2) {
      window.scrollTo(0, 0)
    }
  }

  const handleClick = () => {
    event.preventDefault();
    getData()
    setIsModalOpen(true)
    setScroll(0)

  }

  const handleClose = () => {
    setIsModalOpen(false)
  }

  const nameCutter = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num) + '...';
    } else {
      return str;
    }
  }

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <h1 className={styles.title}>{`Scroll rank: ${scroll}`}</h1>
        <button
          className={joinClasses("btn", "showModal")}
          onClick={handleClick}>Save</button>
      </nav>
      <section ref={scrollSection} className={styles.scroll}
        style={{
          backgroundImage: `url("${bg.src}");`,
          height: isModalOpen ? '100vh' : '500vh',
        }
        }>
      </section>


      <section className={styles.mymodal}

        style={{
          display: isModalOpen ? 'flex' : 'none',
        }}

      >
        <button className={styles.myclose} onClick={handleClose}>X</button>
        <div className={styles.modalСontainer}>
          <h2 className={styles.rank}>Top 10:</h2>
          <ol className={styles.rankList}>
            {data.map((item, idx) => {
              if (item?.name) {
                return <li key={idx}>{`${item.scroll} ${nameCutter(item.name, 20)}`}</li>
              }

            })}
          </ol>
        </div>
      </section>
    </div>
  )
}

export default Home
