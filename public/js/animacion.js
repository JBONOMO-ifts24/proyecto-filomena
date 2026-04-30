const frames = [" (•_•) \n <)   )╯ \n  /    \\ ",
                                    "  (•_•)\n \(   (> \n  /    \\ ",
                                    " (•_•) \n <)   )╯ \n  /    \\ "];
                    let i = 0;
                    const canvas = document.getElementById('ascii-canvas');
                    setInterval(() => {
                        canvas.textContent = frames[i % frames.length];
                        i++;
                    }, 500);