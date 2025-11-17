import { Transaction, TransactionBooking, Review, Category, Item, ExtensionRequest, DamageType, ItemLog, Dispute, ChatMessage, ChatRoom, ReturnRequest } from "@/libs/core/types";
import { TransactionStatus, TransactionType, UserStatus, UserType, ItemActionType, ItemStatus, BookingStatus, MediaType, ExtensionStatus, ReasonReturnType, ReturnRequestStatus, DisputeStatus, DisputeDecision } from "@/libs/core/constants";

import { v4 as uuid } from "uuid";

export const mockAccounts = [
    {
        id: "1",
        username: "nguyenvana",
        password: "123456",
        firstname: "Nguyễn",
        lastname: "Văn A",
        phone_number: "0987654321",
        email: "nguyenvana@example.com",
        ID_number: "012345678901",
        avatar: "https://i.pravatar.cc/150?img=1",
        trust_score: 85,
        coin_balance: 1500,
        user_type: UserType.USER,
        status: UserStatus.ACTIVE,
    },
    {
        id: "2",
        username: "tranthib",
        password: "123456",
        firstname: "Trần",
        lastname: "Thị B",
        phone_number: "0911222333",
        email: "tranthib@example.com",
        ID_number: "079123456789",
        avatar: "https://i.pravatar.cc/150?img=2",
        trust_score: 72,
        coin_balance: 800,
        user_type: UserType.USER,
        status: UserStatus.BANNED,
    },
    {
        id: "3",
        username: "admin01",
        password: "admin123",
        firstname: "Lê",
        lastname: "Quản Trị",
        phone_number: "0909090909",
        email: "admin01@example.com",
        ID_number: "111222333444",
        avatar: "https://i.pravatar.cc/150?img=3",
        trust_score: 100,
        coin_balance: 9999,
        user_type: UserType.ADMIN,
        status: UserStatus.ACTIVE,
    },
];


export const mockItemLogs: ItemLog[] = [
    {
        id: "IL001",
        itemId: "I001",
        accountId: "2", // chủ cho thuê
        action: ItemActionType.CREATE,
        previousStatus: null,
        currentStatus: ItemStatus.PENDING_APPROVAL,
        note: "Người dùng tạo sản phẩm mới: Lều 2 người NatureHike",
        createdAt: "2025-10-15T09:00:00",
    },
    {
        id: "IL002",
        itemId: "I001",
        accountId: "1", // admin
        action: ItemActionType.APPROVE,
        previousStatus: ItemStatus.PENDING_APPROVAL,
        currentStatus: ItemStatus.AVAILABLE,
        note: "Quản trị viên đã phê duyệt sản phẩm hợp lệ.",
        createdAt: "2025-10-16T10:15:00",
    },
    {
        id: "IL003",
        itemId: "I001",
        accountId: "2",
        action: ItemActionType.UPDATE,
        previousStatus: ItemStatus.AVAILABLE,
        currentStatus: ItemStatus.PENDING_APPROVAL,
        note: "Chủ thuê cập nhật mô tả và thêm ảnh minh họa.",
        evidenceUrls: [
            {
                url: "/images/tent_update_1.jpg",
                type: MediaType.IMAGE,
                description: "Ảnh cập nhật mặt bên lều",
            },
            {
                url: "/images/tent_update_2.jpg",
                type: MediaType.IMAGE,
                description: "Ảnh chụp dây neo mới",
            },
        ],
        createdAt: "2025-10-20T14:30:00",
    },
    {
        id: "IL004",
        itemId: "I002",
        accountId: "3",
        action: ItemActionType.CREATE,
        previousStatus: null,
        currentStatus: ItemStatus.PENDING_APPROVAL,
        note: "Đăng mới sản phẩm: Đèn pin siêu sáng",
        createdAt: "2025-10-22T11:45:00",
    },
    {
        id: "IL005",
        itemId: "I002",
        accountId: "1",
        action: ItemActionType.REJECT,
        previousStatus: ItemStatus.PENDING_APPROVAL,
        currentStatus: ItemStatus.REJECTED,
        note: "Hình ảnh không rõ nguồn gốc, yêu cầu cập nhật lại.",
        evidenceUrls: [
            {
                url: "/images/reject_reason.jpg",
                type: MediaType.IMAGE,
                description: "Hình ảnh lỗi hoặc trùng sản phẩm khác",
            },
        ],
        createdAt: "2025-10-23T08:10:00",
    },
];



export const mockTransactions: Transaction[] = [
    {
        id: "T001",
        fromAccountId: "1",
        toAccountId: "2",
        amount: 250000,
        type: TransactionType.RENTAL_PAYMENT,
        status: TransactionStatus.SUCCESS,
        createdAt: "2025-10-28T12:30:00",
    },
    {
        id: "T002",
        fromAccountId: "2",
        toAccountId: "3",
        amount: 500000,
        type: TransactionType.REFUND_DEPOSIT,
        status: TransactionStatus.PENDING,
        createdAt: "2025-10-27T14:45:00",
    },
];

export const mockBookings = [
    {
        id: "B001",
        lesseeId: "1",
        lessorId: "2",
        itemId: "I001",
        quantity: 1,
        pricePerDay: 80000,
        depositAmount: 200000,
        startDate: "2025-10-20",
        endDate: "2025-10-23",
        note: "Khách thuê muốn trả sớm 1 ngày.",
        status: BookingStatus.COMPLETED,
        createdAt: "2025-10-15T08:00:00",
        updatedAt: "2025-10-23T18:00:00",
    },
    {
        id: "B002",
        lesseeId: "1",
        lessorId: "3",
        itemId: "I002",
        quantity: 2,
        pricePerDay: 30000,
        depositAmount: 100000,
        startDate: "2025-10-18",
        endDate: "2025-10-21",
        note: "",
        status: BookingStatus.COMPLETED,
        createdAt: "2025-10-12T09:30:00",
        updatedAt: "2025-10-21T17:15:00",
    },
];


export const mockTransactionBookings: TransactionBooking[] = [
    {
        id: "TB001",
        transactionId: "T001",
        bookingId: "B001",
        createdAt: "2025-10-20T12:00:00",
    },
    {
        id: "TB002",
        transactionId: "T001",
        bookingId: "B002",
        createdAt: "2025-10-20T12:05:00",
    },
];

export const mockReviews: Review[] = [
    {
        id: "R001",
        bookingId: "B001",
        reviewerId: "1",
        reviewedId: "2",
        itemId: "I001",
        rating: 5,
        comment: "Lều rất sạch và dễ dựng. Chủ thuê thân thiện.",
        mediaUrls: [
            { url: "https://images.unsplash.com/photo-1602524810909-67a502a5a9a8", type: MediaType.IMAGE },
        ],
        createdAt: "2025-10-25T10:00:00",
        updatedAt: "2025-10-25T10:00:00",
    },
    {
        id: "R002",
        bookingId: "B002",
        reviewerId: "1",
        reviewedId: "3",
        itemId: "I002",
        rating: 4,
        comment: "Đèn sáng tốt, hơi nặng so với mô tả.",
        mediaUrls: [],
        createdAt: "2025-10-22T09:30:00",
        updatedAt: "2025-10-22T09:30:00",
    },
];

// mockCategories.ts

export const mockCategories: Category[] = [
    {
        id: "C001",
        name: "Lều & Vật dụng ngủ",
        description: "Lều, túi ngủ, đệm khí... phù hợp cho cắm trại và trekking.",
        isDeleted: false,
        createdAt: "2025-08-01T09:00:00",
        updatedAt: "2025-09-01T10:00:00",
    },
    {
        id: "C002",
        name: "Nấu nướng & Bếp",
        description: "Bếp cồn, bếp ga du lịch, bộ nấu ăn, bình gas mini, v.v.",
        isDeleted: false,
        createdAt: "2025-08-05T09:00:00",
        updatedAt: "2025-09-02T10:00:00",
    },
    {
        id: "C003",
        name: "Chiếu & Ghế",
        description: "Ghế gấp, bàn dã ngoại, thảm, chiếu picnic.",
        isDeleted: false,
        createdAt: "2025-08-10T09:00:00",
        updatedAt: "2025-09-05T10:00:00",
    },
    {
        id: "C004",
        name: "Đèn & Điện",
        description: "Đèn pin, đèn treo lều, sạc dự phòng, thiết bị chiếu sáng.",
        isDeleted: false,
        createdAt: "2025-08-12T09:00:00",
        updatedAt: "2025-09-06T10:00:00",
    },
];

// mockItems.ts

export const mockItems: Item[] = [
    {
        id: "I001",
        ownerId: "2", // tham chiếu tới mockAccounts id = "2"
        categoryId: "C001",
        name: "Lều 4 người Naturehike",
        description: "Lều 4 người, chống mưa, lắp ghép nhanh, phù hợp gia đình.",
        pricePerDay: 80000,
        depositAmount: 200000,
        mediaUrls: [
            { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200", type: MediaType.IMAGE, description: "Lều mở toàn cảnh" },
            { url: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c0?w=1200", type: MediaType.IMAGE, description: "Bên trong lều" },
        ],
        status: ItemStatus.AVAILABLE,
        createdAt: "2025-09-10T09:00:00",
        updatedAt: "2025-09-20T10:00:00",
    },
    {
        id: "I002",
        ownerId: "3",
        categoryId: "C004",
        name: "Đèn sạc năng lượng mặt trời X200",
        description: "Đèn treo, sạc pin bằng năng lượng mặt trời, thời lượng 10 giờ.",
        pricePerDay: 30000,
        depositAmount: 50000,
        mediaUrls: [
            { url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=1200", type: MediaType.IMAGE, description: "Đèn pin/đèn treo" },
        ],
        status: ItemStatus.AVAILABLE,
        createdAt: "2025-09-15T10:30:00",
        updatedAt: "2025-09-18T11:00:00",
    },
    {
        id: "I003",
        ownerId: "2",
        categoryId: "C002",
        name: "Bếp cồn mini du lịch",
        description: "Bếp cồn nhỏ gọn, dễ mang, phù hợp nấu nhanh khi dã ngoại.",
        pricePerDay: 50000,
        depositAmount: 30000,
        mediaUrls: [
            { url: "https://images.unsplash.com/photo-1569429594986-3d2f7f5b2d89?w=1200", type: MediaType.IMAGE, description: "Bếp cồn mini" },
        ],
        status: ItemStatus.AVAILABLE,
        createdAt: "2025-09-05T08:00:00",
        updatedAt: "2025-09-12T09:00:00",
    },
    {
        id: "I004",
        ownerId: "1",
        categoryId: "C003",
        name: "Bộ ghế + bàn gấp du lịch",
        description: "Ghế + bàn gấp, nhẹ, chịu lực tốt, phù hợp cắm trại nhóm nhỏ.",
        pricePerDay: 70000,
        depositAmount: 100000,
        mediaUrls: [
            { url: "https://images.unsplash.com/photo-1505765054603-5b7a3bfc3f3b?w=1200", type: MediaType.IMAGE, description: "Ghế và bàn gấp" },
        ],
        status: ItemStatus.AVAILABLE,
        createdAt: "2025-09-02T08:30:00",
        updatedAt: "2025-09-10T09:30:00",
    },
];


export const mockExtensionRequests: ExtensionRequest[] = [
    {
        id: "ER001",
        bookingId: "B001",
        lesseeId: "1",
        lessorId: "2",
        oldEndDate: "2025-10-23",
        requestedNewEndDate: "2025-10-25",
        additionalFee: 160000,
        status: ExtensionStatus.PENDING,
        note: "Người thuê muốn gia hạn thêm 2 ngày để đi phượt xa hơn.",
        createdAt: "2025-10-20T14:30:00",
        updatedAt: "2025-10-20T14:30:00",
    },
    {
        id: "ER002",
        bookingId: "B002",
        lesseeId: "1",
        lessorId: "3",
        oldEndDate: "2025-10-21",
        requestedNewEndDate: "2025-10-24",
        additionalFee: 90000,
        status: ExtensionStatus.APPROVED,
        note: "Chủ thuê đồng ý gia hạn, khách sẽ thanh toán thêm 90.000đ.",
        createdAt: "2025-10-19T09:45:00",
        updatedAt: "2025-10-19T11:00:00",
    },
    {
        id: "ER003",
        bookingId: "B003",
        lesseeId: "4",
        lessorId: "5",
        oldEndDate: "2025-10-28",
        requestedNewEndDate: "2025-10-30",
        additionalFee: 120000,
        status: ExtensionStatus.REJECTED,
        note: "Chủ thuê từ chối vì sản phẩm đã có người đặt tiếp theo.",
        createdAt: "2025-10-22T08:20:00",
        updatedAt: "2025-10-22T09:00:00",
    },
    {
        id: "ER004",
        bookingId: "B004",
        lesseeId: "2",
        lessorId: "6",
        oldEndDate: "2025-10-18",
        requestedNewEndDate: "2025-10-20",
        additionalFee: 50000,
        status: ExtensionStatus.CANCELLED,
        note: "Người thuê hủy yêu cầu do thay đổi kế hoạch.",
        createdAt: "2025-10-15T13:00:00",
        updatedAt: "2025-10-16T09:15:00",
    },
    {
        id: "ER005",
        bookingId: "B005",
        lesseeId: "7",
        lessorId: "8",
        oldEndDate: "2025-10-25",
        requestedNewEndDate: "2025-10-27",
        additionalFee: 60000,
        status: ExtensionStatus.EXPIRED,
        note: "Yêu cầu quá hạn xử lý, tự động hết hiệu lực.",
        createdAt: "2025-10-19T10:00:00",
        updatedAt: "2025-10-21T10:00:00",
    },
];


export const mockDamageTypes: DamageType[] = [
    {
        id: "DT001",
        name: "Trầy xước nhẹ",
        description: "Bề mặt sản phẩm có vết trầy xước nhỏ, không ảnh hưởng đến chức năng.",
        compensationRate: 0.05,
        isDeleted: false,
        createdAt: "2025-10-01T10:00:00",
        updatedAt: "2025-10-01T10:00:00",
    },
    {
        id: "DT002",
        name: "Hư nhẹ",
        description: "Một số bộ phận nhỏ hư, vẫn sử dụng được sau khi sửa chữa đơn giản.",
        compensationRate: 0.1,
        isDeleted: false,
        createdAt: "2025-10-03T09:30:00",
        updatedAt: "2025-10-03T09:30:00",
    },
    {
        id: "DT003",
        name: "Hư nặng",
        description: "Thiết bị hư hỏng nghiêm trọng, cần thay thế linh kiện chính.",
        compensationRate: 0.4,
        isDeleted: false,
        createdAt: "2025-10-05T14:00:00",
        updatedAt: "2025-10-06T10:15:00",
    },
    {
        id: "DT004",
        name: "Mất đồ",
        description: "Khách làm mất hoàn toàn sản phẩm hoặc phụ kiện chính.",
        compensationRate: 1.0,
        isDeleted: false,
        createdAt: "2025-10-10T11:20:00",
        updatedAt: "2025-10-10T11:20:00",
    },
];


export const mockReturnRequests: ReturnRequest[] = [
    {
        id: "RR-001",
        bookingId: "B001",
        lesseeId: "U001",
        lessorId: "U010",
        reason: ReasonReturnType.WRONG_DESCRIPTION,
        evidenceUrls: [
            { url: "https://images.unsplash.com/photo-1505765054603-5b7a3bfc3f3b?w=1200", type: MediaType.IMAGE, description: "Ghế và bàn gấp" },
        ],
        status: ReturnRequestStatus.PENDING,
        note: "Sản phẩm khác với mô tả, màu và kích thước không khớp.",
        adminNote: null,
        createdAt: "2025-11-01T08:12:00Z",
        updatedAt: "2025-11-01T08:12:00Z",
        resolvedAt: null
    },
    {
        id: "RR-002",
        bookingId: "B002",
        lesseeId: "U002",
        lessorId: "U011",
        reason: ReasonReturnType.NO_NEEDED_ANYMORE,
        status: ReturnRequestStatus.APPROVED,
        note: "Tôi không còn nhu cầu sử dụng.",
        adminNote: "Đã hoàn tiền 80%.",
        createdAt: "2025-11-02T09:30:00Z",
        updatedAt: "2025-11-03T11:00:00Z",
        resolvedAt: "2025-11-03T11:00:00Z"
    },
    {
        id: "RR-003",
        bookingId: "B003",
        lesseeId: "U003",
        lessorId: "U012",
        reason: ReasonReturnType.MISSING_PARTS,
        status: ReturnRequestStatus.REJECTED,
        note: "Thiếu một phụ kiện nhỏ.",
        adminNote: "Không đủ bằng chứng, yêu cầu bị từ chối.",
        createdAt: "2025-11-03T10:10:00Z",
        updatedAt: "2025-11-04T09:00:00Z",
        resolvedAt: "2025-11-04T09:00:00Z"
    }
];


export const mockDisputes: Dispute[] = [
    {
        id: "D001",
        bookingId: "B001",
        reporterId: "LessorA",
        defenderId: "LesseeX",
        damageTypeId: "1",
        description: "Lều bị rách ở mặt bên, khó sử dụng lại.",
        evidences: [
            { url: "/images/demo-torn-tent.jpg", type: MediaType.IMAGE, description: "Vết rách lớn" },
        ],
        status: DisputeStatus.PENDING_REVIEW,
        createdAt: new Date().toISOString(),
    },
    {
        id: "D002",
        bookingId: "B002",
        reporterId: "LessorB",
        defenderId: "LesseeY",
        damageTypeId: "2",
        status: DisputeStatus.RESOLVED,
        adminDecision: DisputeDecision.APPROVED,
        adminNote: "Đồng ý mức bồi thường 50%",
        createdAt: new Date().toISOString(),
        resolvedAt: new Date().toISOString(),
    },
];


export const mockChatRooms: ChatRoom[] = [
    {
        id: uuid(),
        chatCode: "CH001",
        participantIds: ["user1", "user2"],
        lastMessage: "Còn lều 2 người không?",
        lastTimestamp: new Date().toISOString(),
        unreadMessageCounts: { user1: 0, user2: 1 },
    },
    {
        id: uuid(),
        chatCode: "CH002",
        participantIds: ["user1", "user3"],
        lastMessage: "Ok cảm ơn!",
        lastTimestamp: new Date().toISOString(),
        unreadMessageCounts: { user1: 0, user3: 0 },
    },
];

export const mockChatMessages: ChatMessage[] = [
    {
        id: uuid(),
        chatCode: "CH001",
        senderId: "user2",
        receiverId: "user1",
        content: "Còn lều 2 người không?",
        timestamp: new Date().toISOString(),
        isRead: false,
    },
    {
        id: uuid(),
        chatCode: "CH001",
        senderId: "user1",
        receiverId: "user2",
        content: "Vẫn còn nhé!",
        timestamp: new Date().toISOString(),
        isRead: true,
    },
];
