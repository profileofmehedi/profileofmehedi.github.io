const chapters = {
  1: {
    title: "অধ্যায় ১: ডটনেট (.NET) কী ও কেন?",
    content: `
            <p>লাল্টু ভাই একদিন চিন্তা করলেন, তিনি এখন আর হাতে লিখে দোকানের হিসাব রাখবেন না। তিনি সবকিছু "ডিজিটাল" করবেন।</p>
            <div class="quote">"মামা, .NET হইলো একটা বিশাল বাজারের মতো। তুমি যদি একটা সফটওয়্যার বানাইতে চাও, তোমাকে শুরু থেকে সব বানাইতে হবে না। এই বাজারে সব রেডিমেড পাবা।"</div>
            <h3>প্রথম কোড:</h3>
            <pre>Console.WriteLine("আসসালামু আলাইকুম দুনিয়া!");</pre>
            <p>এখানে <b>Console.WriteLine</b> হলো লাল্টু ভাইয়ের দোকানের সেই মাইক, যেটা দিয়ে তিনি কাস্টমারদের ডাকেন।</p>
        `,
  },
  2: {
    title: "অধ্যায় ২: ক্লাস ও অবজেক্ট (দোকানের নকশা)",
    content: `
            <p>লাল্টু ভাইয়ের দোকানের একটা নকশা দরকার। নকশা হইলো <b>Class</b> আর দোকানটা হইলো <b>Object</b>।</p>
            <div class="quote">"মামা, ক্লাস হইলো বিয়ার বায়োডাটা, আর অবজেক্ট হইলো জামাই। বায়োডাটা পইড়া পেট ভরে না, জামাই লাগবো!"</div>
            <pre>
public class Dokan {
    public string Nam = "লাল্টু ক্যাফে";
    public void Service() {
        Console.WriteLine("চা রেডি!");
    }
}

// আসল দোকান চালু করা (Instantiating)
Dokan amarDokan = new Dokan();
amarDokan.Service();</pre>
        `,
  },
  3: {
    title: "অধ্যায় ৩: ইনহেরিটেন্স (বাপের সম্পত্তি)",
    content: `
            <p>লাল্টু ভাইয়ের ছেলে পন্টু বড় হয়ে বাপের দোকানের সব সুবিধা নিল, সাথে কফিও যোগ করল। এটাই <b>Inheritance</b>।</p>
            <div class="quote">"বাপের হোটেলে ফ্রি-তে খাওয়া আর বাপের প্রপার্টি ইউজ করাই হইলো ইনহেরিটেন্স। কোডিংয়েও মামা একই সিস্টেম!"</div>
            <pre>
public class PontuDokan : Dokan { // বাপের সম্পত্তি নিল
    public void SellCoffee() {
        Console.WriteLine("কফিও পাবেন মামা!");
    }
}</pre>
        `,
  },
  4: {
    title: "অধ্যায় ৪: ডাটাবেজ (লাল্টু ভাইয়ের গুদাম)",
    content: `
            <p>ডাটাবেজ হইলো লাল্টু ভাইয়ের গুদাম ঘর। যেখানে সব কাস্টমারের হিসাব জমা থাকে।</p>
            <div class="quote">"গুদামে মাল না থাকলে কাস্টমাররে খাওয়াইবা কী? ডাটাবেজ ছাড়া অ্যাপ হইলো তেল ছাড়া ইঞ্জিন!"</div>
            <p><b>SQL Server:</b> এটা হলো লাল্টু ভাইয়ের নিজের গুদাম (Microsoft-এর)।</p>
            <p><b>Oracle:</b> এটা হলো পাশের পাড়ার বিশাল বড় সিকিউর গুদাম।</p>
            <pre>SELECT * FROM Customer WHERE OrderCount > 10;</pre>
            <p>লাল্টু ভাই এই কমান্ড দিয়ে তার দোকানের সেরা কাস্টমারদের খুঁজে বের করেন।</p>
        `,
  },
  5: {
    title: "অধ্যায় ৫: সিস্টেম ডিজাইন (বাজারের ট্রাফিক)",
    content: `
            <p>লাল্টু ভাইয়ের দোকানে যখন হঠাৎ হাজার হাজার কাস্টমার চলে আসে, তখন তিনি কীভাবে সামলান? এটাই সিস্টেম ডিজাইন।</p>
            <div class="quote">"একলা লাল্টু কত চা বানাইবো? যখন কাস্টমার বেশি, তখন পাশে আরেকটা দোকান দিতাম হবে (Scaling)!"</div>
            <ul>
                <li><b>Load Balancer:</b> যে লোকটা লাইনে দাঁড়ানো কাস্টমারদের বলে দেয় কে কোন দোকানে যাবে।</li>
                <li><b>Caching:</b> লাল্টু ভাই আগে থেকেই কিছু চা বানিয়ে ফ্লাস্কে রেখে দেন যাতে কাস্টমার আসা মাত্রই দিতে পারেন।</li>
            </ul>
        `,
  },
};

function loadChapter(id) {
  const body = document.getElementById("content-body");
  body.innerHTML = `
        <h2 style="color: #e67e22; border-bottom: 2px solid #eee; padding-bottom: 10px;">${chapters[id].title}</h2>
        <div class="chapter-content">${chapters[id].content}</div>
        <button class="next-btn" onclick="loadChapter(${id < 5 ? id + 1 : 1})">
            ${id < 5 ? "পরবর্তী অধ্যায় →" : "আবার শুরু থেকে পড়ুন"}
        </button>
    `;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
