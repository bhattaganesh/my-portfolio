import React from "react";
function DarkMode() {
  const body = document.body;
  const lightTheme = "light-theme";
  const darkTheme = "dark-theme";
  const lightIcon = "uil-moon";
  const darkIcon = "uil-sun";
  let theme;

  if (localStorage) {
    theme = localStorage.getItem("selected_theme");
  }

  if (theme === lightTheme || theme === darkTheme) {
    if (!body.classList.contains(theme)) {
      body.classList.add(theme);
    }
  } else {
    body.classList.add(darkTheme);
  }

  const switchTheme = (e) => {
    if (theme === darkTheme) {
      body.classList.replace(darkTheme, lightTheme);
      localStorage.setItem("selected_theme", lightTheme);
      e.target.classList.remove(darkIcon);

      if (!e.target.classList.contains(lightIcon)) {
        e.target.classList.add(lightIcon);
      }
      theme = lightTheme;
    } else {
      body.classList.replace(lightTheme, darkTheme);
      localStorage.setItem("selected_theme", darkTheme);

      e.target.classList.remove(lightIcon);

      if (!e.target.classList.contains(darkIcon)) {
        e.target.classList.add(darkIcon);
      }
      theme = darkTheme;
    }
  };
  return (
    <>
      <i
        className={`uil ${
          theme === lightTheme ? lightIcon : darkIcon
        } change_theme`}
        id="theme-button"
        onClick={(e) => {
          switchTheme(e);
        }}
      ></i>
    </>
  );
}

export default DarkMode;
