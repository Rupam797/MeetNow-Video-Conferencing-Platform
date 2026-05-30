async function checkDeployment() {
  try {
    // 1. Fetch index HTML to get the latest JS bundle filename
    const htmlResponse = await fetch('https://www.vidor.me/signup');
    const htmlText = await htmlResponse.text();
    
    // Extract script src
    const match = htmlText.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (!match) {
      console.log('Could not find JS bundle script tag in HTML!');
      return;
    }
    
    const jsPath = match[1];
    const jsUrl = `https://www.vidor.me${jsPath}`;
    console.log('Latest JS bundle URL:', jsUrl);
    
    // 2. Fetch the JS bundle
    const jsResponse = await fetch(jsUrl);
    const jsText = await jsResponse.text();
    
    // 3. Check for our new code signatures
    const hasFix1 = jsText.includes('endsWith("/")');
    const hasFix2 = jsText.includes('endsWith("/api/v1.0")');
    
    console.log('Deployment status:');
    console.log('- Contains slash check:', hasFix1);
    console.log('- Contains api/v1.0 check:', hasFix2);
    
    if (hasFix1 && hasFix2) {
      console.log('✅ The fix IS DEPLOYED AND LIVE!');
    } else {
      console.log('❌ The fix is NOT deployed yet.');
    }
  } catch (err) {
    console.error('Error checking deployment:', err);
  }
}

checkDeployment();
