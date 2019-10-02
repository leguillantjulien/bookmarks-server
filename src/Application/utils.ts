export function isUrlValid(url: string) {
  let expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  let regex = new RegExp(expression);
  if (url.match(regex)) {
    return true;
  } else {
    return false;
  }
}

export function isFlickerUrl(url: string) {
  if (isUrlValid(url) && url.includes('flickr.com/photos/')) {
    return true;
  } else {
    return false;
  }
}

export function isVimeoUrl(url: string) {
  if (isUrlValid(url) && url.includes('vimeo.com/')) {
    return true;
  } else {
    return false;
  }
}
