import React, { useState, useEffect } from 'react';
import alanBtn from '@alan-ai/alan-sdk-web';
import { Typography } from '@material-ui/core';
import wordsToNumbers from 'words-to-numbers';
import { NewsCards, Modal } from './components';

import logo from './images/logo.png';
import useStyles from './styles';

const AlanAIKey = 'ad9506813d8eb075eb37e2bb481dce382e956eca572e1d8b807a3e2338fdd0dc/stage';

const App = () => {
    const [activeArticle, setActiveArticle] = useState(-1);
    const [newsArticles, setNewsArticles] = useState([]);
    const [isOpen, setIsOpen] = useState(false);


    const classes = useStyles();

    useEffect(() => {
        alanBtn({
            key: AlanAIKey,
            onCommand: ({ command, articles, number }) => {
                if (command === 'newHeadlines') {
                    setNewsArticles(articles);
                } else if (command === 'instructions') {
                    setIsOpen(true);
                } else if (command === 'highlight') {
                    setActiveArticle((prevActiveArticle) => prevActiveArticle + 1);
                } else if (command === 'open') {
                    const parsedNumber = number.length > 2 ? wordsToNumbers((number), { fuzzy: true }) : number;
                    const article = articles[parsedNumber - 1];

                    if (parsedNumber > articles.length) {
                        alanBtn().playText('Please try that again...');
                    } else if (article) {
                        window.open(article.url, '_blank');
                        alanBtn().playText('Opening...');
                    } else {
                        alanBtn().playText('Please try that again...');
                    }
                }
            },

        });
    }, []);

    return (
        <div>
            <div className={classes.logoContainer}>
                <img src="https://alan.app/voice/images/previews/preview.jpg" className={classes.alanLogo} alt="logo" />
            </div>
            <NewsCards articles={newsArticles} activeArticle={activeArticle} />
            <Modal isOpen={isOpen} setIsOpen={setIsOpen} />
            {!newsArticles.length ? (
                <div className={classes.footer}>
                    <Typography variant="body1" component="h2">
                        Created by
                    <a className={classes.link} href="https://in.linkedin.com/in/girish-godage-0a80422"> Girish Godage</a> -
                    <a className={classes.link} href="https://girishgodage.in/blog"> My Blog</a>
                    </Typography>
                    <img className={classes.image} src={logo} height="50px" alt="logo" />
                </div>
            ) : null}
        </div>
    )
}

export default App
