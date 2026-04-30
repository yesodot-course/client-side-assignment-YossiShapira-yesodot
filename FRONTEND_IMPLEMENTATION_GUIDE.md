# Frontend Implementation Guide (Aligned To Your Backend)

המטרה של הקובץ הזה היא לתת לך תכנית עבודה פרקטית ומדויקת לבניית ה־frontend, לפי:
- הדרישות של `README.md` בצד הלקוח
- ה־endpoints שבאמת קיימים אצלך ב־`Server-side-Assignment`
- ארכיטקטורה נקייה שמתאימה ל־React + Redux + React Router + useQuery

---

## 1) מה קיים כרגע (מצב פתיחה)

בפרויקט `client-side-assignment-YossiShapira-yesodot` כרגע יש בעיקר קבצי קונפיגורציה (`tsconfig`, `eslint`, `prettier`) וללא קוד אפליקטיבי ב־`src`.

כלומר, אתה מתחיל בפועל מ־0 בצד ה־UI והלוגיקה, וזה בסדר לגמרי.

---

## 2) מיפוי API מדויק לשרת שלך

Base URL:
- `http://localhost:<SERVER_PORT>/api`

Health check:
- `GET /health`

### Items
- `POST /api/items`
- `GET /api/items`
- `GET /api/items/search?q=...`
- `GET /api/items/:id`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`

### Suppliers
- `POST /api/suppliers`
- `GET /api/suppliers`
- `GET /api/suppliers/search/query?q=...`
- `GET /api/suppliers/:id`
- `PUT /api/suppliers/:id`
- `DELETE /api/suppliers/:id`

### Orders
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/search/query?q=...`
- `GET /api/orders/:id`
- `PUT /api/orders/:id`
- `DELETE /api/orders/:id`

### Analytics
- `GET /api/analytics/revenue/monthly`
- `GET /api/analytics/profitable/category/weekly`
- `GET /api/analytics/profitable/item/daily`
- `GET /api/analytics/profitable/supplier`
- `GET /api/analytics/margin/items`
- `GET /api/analytics/suppliers/spending`

---

## 3) מבנה תגובות שגיאה שחשוב לפרונט

בשרת שלך, שגיאות חוזרות בפורמט עקבי:

```json
{
  "message": "some message",
  "code": "APP_ERROR | VALIDATION_ERROR | INTERNAL_ERROR",
  "details": null
}
```

מה זה אומר לפרונט:
- תמיד לקרוא `message` ולהציג Toast ידידותי למשתמש.
- במקרה `VALIDATION_ERROR`, להשתמש גם ב־`details` להצגת שגיאות שדה בטפסים.
- לא להניח שכל שגיאה היא 500; יש לך גם 400 / 404 / 409 משמעותיים.

---

## 4) אילוצי עסק שחייבים להשתקף ב־UI

### Items
- מחיר מוצר (`price`) חייב להיות לפחות 30% מעל `supplierPrice`.
- `supplierPrice` חייב להתאים למחיר הקטלוג של הספק עבור אותו פריט.
- חיפוש קיים לפי `name` או `category` (לא לפי supplier).

### Orders
- מקסימום 10 פריטים ייחודיים להזמנה.
- אם אין מלאי מספיק, השרת מחזיר `409`.
- לקוח מוגבל ל־50 פריטים מצטבר (לפי `customerId`) על פני כל ההזמנות.
- בעת יצירת הזמנה המלאי יורד; במחיקת הזמנה המלאי חוזר.

### Suppliers
- מחיקת ספק מוחקת גם את פריטי החנות של אותו ספק.
- עדכון ספק (קטלוג פריטים/מחירים) עלול למחוק או לעדכן אוטומטית פריטי חנות קשורים.

השלכה לפרונט:
- אחרי פעולות Admin/Order חייבים לבצע invalidate ל־queries רלוונטיות כדי לרענן UI.

---

## 5) ארכיטקטורה מומלצת לפרויקט ה־frontend

מומלץ לעבוד בגישת Feature-First עם שכבות ברורות:

```text
src/
  app/
    providers/
      AppProviders.tsx
    router/
      AppRouter.tsx
    store/
      store.ts
      hooks.ts
  shared/
    api/
      httpClient.ts
      queryClient.ts
      apiError.ts
    ui/
      components/
      layout/
    lib/
      formatters.ts
      validators.ts
    types/
      api.ts
  features/
    items/
      api/
      hooks/
      components/
      pages/
      types.ts
    cart/
      store/
      selectors/
      components/
      pages/
      types.ts
    suppliers/
      api/
      hooks/
      components/
      types.ts
    orders/
      api/
      hooks/
      components/
      types.ts
    analytics/
      api/
      hooks/
      components/
      types.ts
  pages/
    HomePage.tsx
    ProductDetailsPage.tsx
    CartPage.tsx
    AdminPage.tsx
    NotFoundPage.tsx
  main.tsx
```

עקרון חשוב:
- `useQuery`/`useMutation` לשכבת server state
- Redux רק ל־client state (עגלה, פילטרים מקומיים, UI state)

---

## 6) מודל נתונים לפרונט (TypeScript Interfaces)

```ts
export interface SupplierItem {
  itemName: string;
  price: number;
}

export interface Supplier {
  _id: string;
  name: string;
  contactInfo: string;
  items: SupplierItem[];
}

export interface Item {
  _id: string;
  name: string;
  price: number;
  supplierPrice: number;
  stock: number;
  category: string;
  supplier: Supplier | string; // בגלל populate
}

export interface OrderLine {
  item: Item | string; // בגלל populate
  quantity: number;
}

export interface Order {
  _id: string;
  customerId: string;
  items: OrderLine[];
  address: string;
  orderDate: string;
  status: string;
  totalPrice: number;
  shopProfit: number;
  totalItemsQuantity: number;
}
```

---

## 7) עמודים ומה כל אחד חייב לכלול

## Home
- רשימת מוצרים (`GET /api/items`)
- חיפוש לפי שם/קטגוריה (`GET /api/items/search?q=...`)
- פילטרים: category, supplier, price range (פילטר בצד לקוח או שרת; כרגע endpoint כללי, אז קל להתחיל בצד לקוח)
- מיון: price/name asc/desc
- הוספה לעגלה עם quantity (לא לעבור `stock`)
- ניווט ל־Cart

## Product Details
- טעינת מוצר לפי id (`GET /api/items/:id`)
- הצגת כל פרטי מוצר
- הוספה לעגלה עם quantity

## Cart
- ניהול פריטים בעגלה (Redux slice)
- כפתורי `+` / `-`, מחיקה, ניקוי עגלה
- חישוב total price
- המלצות (MVP: אקראי לפי קטגוריות שכבר בעגלה)
- Checkout: יצירת הזמנה (`POST /api/orders`)

## Admin
- CRUD מלא למוצרים (`/api/items`)
- CRUD לספקים (`/api/suppliers`)
- אזור אנליטיקה עם כל 6 endpoints של analytics
- הצגת מוצרים עם stock < 5 (מחושב מה־items list)
- total number of products (מחושב מאורך המערך)

---

## 8) מיפוי Query Keys מומלץ (React Query)

```ts
["items"]
["items", "search", q]
["items", "detail", itemId]
["suppliers"]
["suppliers", "search", q]
["orders"]
["orders", "search", q]
["analytics", "monthlyRevenue"]
["analytics", "weeklyCategory"]
["analytics", "dailyItem"]
["analytics", "marginItems"]
["analytics", "topSupplier"]
["analytics", "supplierSpending"]
```

Invalidation אחרי mutations:
- יצירת/עדכון/מחיקת Item => invalidate `items`, `analytics`, וגם `orders` אם רלוונטי לתצוגה
- יצירת/עדכון/מחיקת Supplier => invalidate `suppliers`, `items`, `analytics`
- יצירת/מחיקת Order => invalidate `orders`, `items`, `analytics`

---

## 9) תכנית מימוש לפי שלבים (כדאי לעבוד בסדר הזה)

1. **Bootstrap**
   - יצירת פרויקט Vite React TS
   - התקנת: `react-router-dom`, `@reduxjs/toolkit`, `react-redux`, `@tanstack/react-query`, `axios`, `react-toastify`

2. **Infrastructure**
   - `AppProviders` (Redux + QueryClient + Router)
   - `httpClient` עם `baseURL` מה־env
   - centralized error parser

3. **Routing + Layout**
   - Routes: `/`, `/items/:id`, `/cart`, `/admin`, `*`
   - Header קבוע עם חיפוש/לינקים/מונה עגלה

4. **Redux Cart**
   - add/remove/clear/increase/decrease
   - selectors: totalPrice, totalCount, grouped categories

5. **Items Feature**
   - API hooks + list + filters + sorting + search
   - Details page

6. **Orders Feature**
   - Checkout form (`customerId`, `address`)
   - בניית payload של items מתוך העגלה
   - טיפול חכם בשגיאות 400/409

7. **Suppliers + Admin CRUD**
   - טפסי יצירה/עדכון לספקים ומוצרים
   - ולידציות מקדימות (גם אם יש ולידציה בשרת)

8. **Analytics Panel**
   - 6 widgets (כל endpoint widget נפרד)
   - Loading/Error לכל widget

9. **Polish**
   - responsiveness
   - empty states / loading skeletons
   - toast notifications עקביות

---

## 10) חוזי payloadים שימושיים לפרונט

### Create Item
`POST /api/items`

```json
{
  "name": "string",
  "price": 130,
  "supplierPrice": 100,
  "stock": 10,
  "category": "string",
  "supplier": "supplierId"
}
```

### Create Supplier
`POST /api/suppliers`

```json
{
  "name": "string",
  "contactInfo": "string",
  "items": [
    { "itemName": "string", "price": 50 }
  ]
}
```

### Create Order
`POST /api/orders`

```json
{
  "customerId": "string",
  "address": "string",
  "items": [
    { "item": "itemId", "quantity": 2 }
  ]
}
```

---

## 11) נקודות זהירות חשובות

- מסלולי search לא אחידים בין resources:
  - items: `/search`
  - suppliers/orders: `/search/query`
  חשוב לקודד זאת במדויק בשכבת API.

- `supplier` בתוך Item לפעמים populate object ולפעמים מזהה; תטפל בזה בטיפוסים/guards.

- ב־Order update השרת מתעלם מ־`items`; אל תבנה UI שמצפה לעריכת שורות הזמנה קיימת.

- אנליטיקות מסוימות יכולות להחזיר `null` כשאין נתונים; ה־UI חייב להציג empty state ולא לקרוס.

---

## 12) Definition of Done (צ'קליסט)

- [ ] כל 4 העמודים עובדים ומנווטים עם React Router
- [ ] עגלה מנוהלת ב־Redux בלבד
- [ ] כל שליפות שרת דרך useQuery/useMutation
- [ ] כל ה־CRUDים (items/suppliers) עובדים מול השרת שלך
- [ ] checkout יוצר הזמנה אמיתית ומרוקן עגלה בהצלחה
- [ ] analytics section מציג את כל 6 המדדים
- [ ] טיפול מלא ב־loading/error/success states
- [ ] responsive בסיסי לדסקטופ + מובייל
- [ ] TypeScript ללא `any` וללא `ts-ignore`

---

## 13) בונוס פרקטי להאצת עבודה

אם אתה רוצה, השלב הבא הכי יעיל הוא לייצר קודם skeleton מלא (routes + store + API layer + types + pages ריקות), ורק אחר כך למלא פיצ'ר-פיצ'ר. זה חוסך refactor מוקדם.

---

## 14) File-by-file blueprint (רשימת קבצים מדויקת)

זאת רשימת קבצים קונקרטית שאתה יכול ליצור כדי לעבוד מסודר מהתחלה.

```text
src/
  main.tsx

  app/
    providers/
      AppProviders.tsx
    router/
      AppRouter.tsx
      routePaths.ts
    store/
      store.ts
      hooks.ts
      rootReducer.ts

  shared/
    api/
      httpClient.ts
      queryClient.ts
      apiError.ts
      queryKeys.ts
    config/
      env.ts
    types/
      api.ts
      common.ts
    lib/
      formatters.ts
      guards.ts
      validators.ts
    ui/
      layout/
        AppLayout.tsx
      components/
        AppHeader.tsx
        PageContainer.tsx
        LoadingState.tsx
        ErrorState.tsx
        EmptyState.tsx
        QuantityInput.tsx
      feedback/
        toast.ts

  features/
    items/
      api/
        items.api.ts
      hooks/
        useItems.ts
        useItemDetails.ts
        useSearchItems.ts
        useCreateItem.ts
        useUpdateItem.ts
        useDeleteItem.ts
      components/
        ItemCard.tsx
        ItemsGrid.tsx
        ItemSearchBar.tsx
        ItemFilters.tsx
        ItemSort.tsx
        ItemDetailsCard.tsx
        ItemFormModal.tsx
        AdminItemsTable.tsx
      utils/
        itemsFilters.ts
        itemsSort.ts
      types.ts

    cart/
      store/
        cart.slice.ts
      selectors/
        cart.selectors.ts
      components/
        AddToCartPanel.tsx
        CartList.tsx
        CartItemRow.tsx
        CartSummary.tsx
        CartRecommendations.tsx
        CheckoutForm.tsx
      utils/
        recommendations.ts
      types.ts

    suppliers/
      api/
        suppliers.api.ts
      hooks/
        useSuppliers.ts
        useSearchSuppliers.ts
        useCreateSupplier.ts
        useUpdateSupplier.ts
        useDeleteSupplier.ts
      components/
        SupplierTable.tsx
        SupplierFormModal.tsx
      types.ts

    orders/
      api/
        orders.api.ts
      hooks/
        useOrders.ts
        useSearchOrders.ts
        useCreateOrder.ts
        useDeleteOrder.ts
      components/
        OrdersTable.tsx
      types.ts

    analytics/
      api/
        analytics.api.ts
      hooks/
        useMonthlyRevenue.ts
        useWeeklyCategory.ts
        useDailyItem.ts
        useMarginItems.ts
        useTopSupplier.ts
        useSupplierSpending.ts
      components/
        MonthlyRevenueCard.tsx
        WeeklyCategoryCard.tsx
        DailyItemCard.tsx
        MarginItemsCard.tsx
        TopSupplierCard.tsx
        SupplierSpendingTable.tsx
        AdminAnalyticsPanel.tsx
      types.ts

  pages/
    HomePage.tsx
    ProductDetailsPage.tsx
    CartPage.tsx
    AdminPage.tsx
    NotFoundPage.tsx
```

### מה נכנס בכל page

- `HomePage.tsx`
  - `ItemSearchBar`, `ItemFilters`, `ItemSort`, `ItemsGrid`
  - קישור לעמוד עגלה

- `ProductDetailsPage.tsx`
  - `ItemDetailsCard`, `AddToCartPanel`

- `CartPage.tsx`
  - `CartList`, `CartSummary`, `CheckoutForm`, `CartRecommendations`

- `AdminPage.tsx`
  - `AdminItemsTable`, `ItemFormModal`
  - `SupplierTable`, `SupplierFormModal`
  - `AdminAnalyticsPanel`

### חוקי חלוקה בין שכבות

- `api/*.api.ts`
  - פונקציות HTTP נטו, בלי JSX.
- `hooks/*.ts`
  - `useQuery`/`useMutation` בלבד + invalidate.
- `components/*.tsx`
  - UI בלבד, בלי קריאות axios ישירות.
- `store/*.ts`
  - Redux state (בעיקר cart + UI state קטן), לא server data.
