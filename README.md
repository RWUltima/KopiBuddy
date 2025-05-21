# KopiBuddy


icon-192.png and icon-512.png are used for PWA home screen icons

Note: Back button in Step 7 is tricky. Since softdrink inputs is not part of the normal step flow (jumps from Step 1 to special step), hence "currentstep" may not track it properly. Have used showStep('step1') directly to ensure it reliably jumps back to the main drink selection page. 