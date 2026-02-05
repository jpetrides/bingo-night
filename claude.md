# Bingo Night Project

## Overview
Single-page static website for St Anthony of Padua School PTO Family Bingo Night event. Hosted on GitHub Pages at https://jpetrides.github.io/bingo-night/. Repository: https://github.com/jpetrides/bingo-night

## Tech Stack
- Single `index.html` file with embedded CSS and JavaScript
- No build tools, frameworks, or dependencies
- GitHub Pages for hosting (auto-deploys on push to `main` branch, takes 1-2 minutes)

## Color Scheme (from colors.json)
- **Navy (#3E4A5C)** - Page background, footer, package boxes, table headers, text
- **Gold (#D4C5A0)** - Header background, section borders, form input borders
- **Light Gold (#E5D9BA)** - Highlight boxes, contact info background, important notes
- **White (#FFFFFF)** - Container background, text on dark backgrounds
- **Red (#E31E24)** - Buttons only (payment, calendar, copy, form submit). Also used for important note borders and pricing table amounts. Hover state: #C41A1F

## Key Features

### Bilingual Support (English/Spanish)
- Language toggle button in top-right of header (red button)
- Switches between "Español" and "English"
- All content translates dynamically (headings, body text, form labels, placeholders, buttons)
- Language preference stored in localStorage and persists across visits
- Single HTML file implementation using data-i18n attributes and JavaScript translations object

### Pre-Order Form (Google Sheets Integration)
- Custom HTML form replaces previous Venmo/PayPal/Zelle payment sections (school policy prohibits personal payment collection)
- Form submits via `fetch()` with `mode: 'no-cors'` to a Google Apps Script web app
- Google Apps Script URL: `https://script.google.com/macros/s/AKfycbyGbZC_SgJ3TKrrcvg6sKFIsqa1xPkL-tL53kGrIRl5sojB8RAoAR1OFK8gKZTP3LLhrg/exec`
- Payment is collected at the door; the form only reserves the pre-order
- Form fields: Family Name*, Email*, Phone, Pizza Type*, Extra Pizzas (with dynamic type selectors), Notes
- **Note**: Student name field was removed but form still sends empty string for 'student' to maintain Google Sheets column structure
- Order total calculates dynamically ($30 base + $15 per extra pizza)
- Shows success message after submission, hides form
- Form labels and placeholders translate with language toggle

### Google Apps Script Backend
The Apps Script is deployed as a web app on Joe's personal Google account. It receives POST requests and appends rows to a Google Sheet with columns:
`Timestamp | Family Name | Email | Phone | Student | Pizza Type | Extra Pizzas | Extra Pizza Types | Total | Notes`

The Apps Script code:
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(), data.familyName, data.email, data.phone, data.student,
    data.pizzaType, data.extraPizzas, data.extraPizzaTypes, '$' + data.total, data.notes
  ]);
  return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

To redeploy: Google Sheets > Extensions > Apps Script > Deploy > Manage deployments

### "Click to Pre-Order Pizza" Button
- Prominent red button in the header, below the date/time bubble
- Smooth-scrolls to the "Pre-Order Package (Highly Encouraged!)" section (id="pre-order"), NOT directly to the form, so users see package details and pricing first

### Calendar Integration
- **Google Calendar**: Direct URL link with pre-filled event details (opens in new tab)
- **Apple Calendar**: JavaScript generates and downloads an .ics file with a 24-hour reminder
- Event: Feb 6, 2026, 6-8 PM EST (UTC times: 23:00-01:00)

### Contact Section
- Copy-to-clipboard buttons for email and phone (uses `navigator.clipboard.writeText`)
- Buttons show "Copied!" with green background for 2 seconds
- "Copied!" text also translates based on current language
- Links: mailto for email, sms: for iMessage/text, wa.me for WhatsApp (opens in new tab)

### Content Sections
- **Join Us**: Simple intro paragraph emphasizing event is tomorrow (removed previous 4-step process)
- **Volunteers Needed**: Highlight box with Track It Forward registration link
- **Food Donations**: Contact info for Joe to coordinate hot food donations
- **Pre-Order Package**: Package details, pricing table, deadline notice
- **Pre-Order Form**: Main reservation form
- **Questions**: Contact section with copy buttons and multiple contact methods

## File Structure
- `index.html` - The entire website (HTML + CSS + JS)
- `Logo.png` - Event logo displayed in header
- `QR Codes/` - Directory with Venmo.png, Paypal.jpg, Zelle1.jpeg (no longer used on site but still in repo)
- `colors.json` - School color palette reference
- `BINGO_NIGHT.md` - Original event content document (very large file ~345KB due to embedded images)
- `claude.md` - This file

## Event Details
- **Event**: St Anthony of Padua PTO Family Bingo Night
- **Date**: Friday, February 6th, 2026, 6:00 PM - 8:00 PM
- **Location**: St Anthony's School Cafeteria
- **Organizer**: Joe Petrides (joe.petrides@gmail.com / 703-254-6206)
- **Volunteer signup**: https://www.trackitforward.com/site/1119206/event/1187707
- **Pre-order deadline**: 4pm Friday, February 6th
- **Package**: $30 (1 large pizza, 10 bingo cards, 4 drinks, 4 desserts/chips)
- **Extra pizzas**: $15 each (Cheese, Pepperoni, or Veggie)
