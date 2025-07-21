document.addEventListener('DOMContentLoaded', () => {
    // *** เปลี่ยน URL นี้ด้วย URL CSV ของ Google Sheet ที่เผยแพร่แล้วของคุณ ***
    const googleSheetCsvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRKIjLg4uIO82o5xpBE_WnW6ThVJQFOns6Bvf7R8vOIEtzYbUay_T29iJEaGakUZD_39AZ8AJYXXFJQ/pub?output=csv'; 
    const totalAmountElement = document.getElementById('totalAmount');
    const donorsListElement = document.getElementById('donors');

    async function fetchDonors() {
        try {
            const response = await fetch(googleSheetCsvUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const csvText = await response.text();
            parseCsvAndDisplay(csvText);
        } catch (error) {
            console.error("เกิดข้อผิดพลาดในการดึงข้อมูล Google Sheet:", error);
            totalAmountElement.textContent = "เกิดข้อผิดพลาดในการโหลด";
            donorsListElement.innerHTML = '<li>ไม่สามารถโหลดรายชื่อผู้บริจาคได้</li>';
        }
    }

    function parseCsvAndDisplay(csv) {
        const rows = csv.split('\n').map(row => row.trim()).filter(row => row.length > 0);
        
        // สมมติว่าแถวแรกคือหัวข้อ เราจะข้ามไป
        const dataRows = rows.slice(1); 

        let totalAmount = 0;
        donorsListElement.innerHTML = ''; // ล้างรายการเดิมออกไปก่อน

        dataRows.forEach(row => {
            const columns = row.split(',').map(col => col.trim());
            // สมมติว่าคอลัมน์ A คือชื่อผู้บริจาค (index 0) และคอลัมน์ B คือจำนวนเงิน (index 1)
            const donorName = columns[0];
            let donationAmount = parseFloat(columns[3]);

            if (isNaN(donationAmount)) {
                donationAmount = 0; // จัดการกรณีที่จำนวนเงินไม่เป็นตัวเลข
            }
            
            totalAmount += donationAmount;

            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="donor-name">${donorName}</span>
                <span class="donation-amount">${donationAmount.toLocaleString('th-TH')} บาท</span>
            `;
            donorsListElement.appendChild(listItem);
        });

        totalAmountElement.textContent = `${totalAmount.toLocaleString('th-TH')} บาท`;
    }

    // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อโหลดหน้าเว็บครั้งแรก
    fetchDonors();

    // ตั้งเวลาให้ดึงข้อมูลใหม่ทุกๆ 30 วินาที เพื่อการอัปเดตแบบเรียลไทม์
    setInterval(fetchDonors, 10000); 
});
