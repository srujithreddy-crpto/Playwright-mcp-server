const { test, expect } = require('@playwright/test');

test('Get product names and count occurrences', async ({ page }) => {
    try {
        // Navigate to the login page with timeout and wait until network is idle
        await page.goto('https://rahulshettyacademy.com/loginpagePractise/', {
            timeout: 30000,
            waitUntil: 'networkidle'
        });

        // Wait for the login form to be visible and fill credentials
        await expect(page.locator('#username')).toBeVisible();
        await page.locator('#username').fill('rahulshettyacademy');
        await page.locator('#password').fill('learning');
        
        // Click sign in and wait for navigation
        await Promise.all([
            page.waitForNavigation(),
            page.locator('#signInBtn').click()
        ]);

        // Wait for products to be visible and loaded
        await page.waitForSelector('.card-title', { state: 'visible', timeout: 10000 });
        
        // Get all product names with error handling
        const productElements = await page.$$('.card-title');
        console.log(`Found ${productElements.length} products`);
        
        const productNames = [];
        for (const element of productElements) {
            const name = await element.textContent();
            if (name) {
                productNames.push(name.trim());
            }
        }

        // Create a map to store product counts
        const productCounts = new Map();
        
        // Count occurrences of each product
        productNames.forEach(name => {
            const count = productCounts.get(name) || 0;
            productCounts.set(name, count + 1);
        });
        
        // Log the results in a formatted way
        console.log('\nProducts and their counts:');
        console.log('------------------------');
        productCounts.forEach((count, name) => {
            console.log(`${name}: ${count} time(s)`);
        });
        
        // Assertions
        expect(productNames.length).toBeGreaterThan(0, 'No products found on the page');
        expect(productElements.length).toBe(productNames.length, 'Some product names could not be retrieved');

    } catch (error) {
        console.error('Test failed:', error.message);
        throw error;
    }
});