import java.util.Random;

public class QuickSort {
    
    private static final int INSERTION_SORT_THRESHOLD = 10;
    private static final Random random = new Random();
    
    /**
     * 快速排序主方法 - 公共接口
     * @param arr 待排序的数组
     */
    public static void quickSort(int[] arr) {
        if (arr == null || arr.length <= 1) {
            return;
        }
        quickSort(arr, 0, arr.length - 1);
    }
    
    /**
     * 快速排序递归方法
     * @param arr 数组
     * @param low 起始索引
     * @param high 结束索引
     */
    private static void quickSort(int[] arr, int low, int high) {
        if (low < high) {
            // 对于小数组，使用插入排序
            if (high - low + 1 <= INSERTION_SORT_THRESHOLD) {
                insertionSort(arr, low, high);
                return;
            }
            
            // 随机化基准选择以避免最坏情况
            randomizePivot(arr, low, high);
            
            // 获取分区索引
            int pi = partition(arr, low, high);
            
            // 递归排序分区前后的元素
            quickSort(arr, low, pi - 1);
            quickSort(arr, pi + 1, high);
        }
    }
    
    /**
     * 随机化基准选择，避免最坏情况的O(n^2)时间复杂度
     * @param arr 数组
     * @param low 起始索引
     * @param high 结束索引
     */
    private static void randomizePivot(int[] arr, int low, int high) {
        int randomIndex = low + random.nextInt(high - low + 1);
        swap(arr, randomIndex, high);
    }
    
    /**
     * 分区方法 - 使用Lomuto分区方案
     * @param arr 数组
     * @param low 起始索引
     * @param high 结束索引
     * @return 基准点的最终位置
     */
    private static int partition(int[] arr, int low, int high) {
        // 选择最右边的元素作为基准
        int pivot = arr[high];
        
        // 较小元素的索引，表示在pivot左边的边界
        int i = low - 1;
        
        for (int j = low; j < high; j++) {
            // 如果当前元素小于或等于基准
            if (arr[j] <= pivot) {
                i++;
                swap(arr, i, j);
            }
        }
        
        // 交换arr[i+1]和arr[high] (pivot)
        swap(arr, i + 1, high);
        
        return i + 1;
    }
    
    /**
     * 交换数组中两个元素的位置
     * @param arr 数组
     * @param i 索引1
     * @param j 索引2
     */
    private static void swap(int[] arr, int i, int j) {
        int temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    /**
     * 对小数组使用插入排序进行优化
     * @param arr 数组
     * @param low 起始索引
     * @param high 结束索引
     */
    private static void insertionSort(int[] arr, int low, int high) {
        for (int i = low + 1; i <= high; i++) {
            int key = arr[i];
            int j = i - 1;
            
            while (j >= low && arr[j] > key) {
                arr[j + 1] = arr[j];
                j--;
            }
            
            arr[j + 1] = key;
        }
    }
    
    /**
     * 打印数组的辅助方法
     * @param arr 要打印的数组
     */
    public static void printArray(int[] arr) {
        if (arr == null || arr.length == 0) {
            System.out.println("数组为空");
            return;
        }
        
        for (int value : arr) {
            System.out.print(value + " ");
        }
        System.out.println();
    }
    
    /**
     * 测试快速排序算法
     */
    public static void main(String[] args) {
        // 测试用例1：普通数组
        int[] arr1 = {10, 7, 8, 9, 1, 5, 2, 3, 6, 4};
        System.out.println("测试用例1 - 排序前:");
        printArray(arr1);
        
        quickSort(arr1);
        
        System.out.println("测试用例1 - 排序后:");
        printArray(arr1);
        
        // 测试用例2：已排序数组
        int[] arr2 = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        System.out.println("\n测试用例2 - 已排序数组:");
        printArray(arr2);
        
        quickSort(arr2);
        
        System.out.println("测试用例2 - 排序后:");
        printArray(arr2);
        
        // 测试用例3：逆序数组
        int[] arr3 = {10, 9, 8, 7, 6, 5, 4, 3, 2, 1};
        System.out.println("\n测试用例3 - 逆序数组:");
        printArray(arr3);
        
        quickSort(arr3);
        
        System.out.println("测试用例3 - 排序后:");
        printArray(arr3);
        
        // 测试用例4：空数组和单元素数组
        int[] arr4 = {};
        int[] arr5 = {42};
        
        System.out.println("\n测试用例4 - 空数组:");
        quickSort(arr4);
        printArray(arr4);
        
        System.out.println("测试用例5 - 单元素数组:");
        quickSort(arr5);
        printArray(arr5);
    }
}
