/**
 * Low-cost method if checking if a file exists on remote
 * @param url URL to check
 * @returns True if the file returns with 200 OK
 */
export async function exists(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        const { status } = xhr;
        if (status === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    };
    xhr.open('HEAD', url);
    xhr.send();
  });
}
