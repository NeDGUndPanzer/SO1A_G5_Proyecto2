#include <linux/module.h>
#include <linux/init.h>
#include <linux/proc_fs.h>
#include <linux/sched.h>
#include <linux/uaccess.h>
#include <linux/fs.h>
#include <linux/sysinfo.h>
#include <linux/seq_file.h>
#include <linux/slab.h>
#include <linux/sched/signal.h>
#include <linux/mm.h>
#include <linux/swap.h>

struct task_struct *task;

static int my_proc_show(struct seq_file *m, void *v){
	seq_printf(m, "<html>\n");
    for_each_process(task) {
    		seq_printf(m, "%d;%s;%li;%d\n", task->pid, task->comm, task->state, task->cred->uid.val);
    }
    seq_printf(m, "</html>\n");
	return 0;
}

static ssize_t my_proc_write(struct file* file, const char __user *buffer, size_t count, loff_t *f_pos){
	return 0;
}

static int my_proc_open(struct inode *inode, struct file *file){
	return single_open(file, my_proc_show, NULL);
}

static struct file_operations my_fops={
	.owner = THIS_MODULE,
	.open = my_proc_open,
	.release = single_release,
	.read = seq_read,
	.llseek = seq_lseek,
	.write = my_proc_write
};

static int __init process_list_init(void){
	struct proc_dir_entry *entry;
	entry = proc_create("process_list", 0777, NULL, &my_fops);
	if(!entry){
		return -1;	
	}else{
		printk(KERN_INFO "Modulo process_list creado.\n");
	}
	return 0;
}

static void __exit process_list_exit(void){
	remove_proc_entry("process_list", NULL);
	printk(KERN_INFO "Modulo process_list terminado.\n");
}

module_init(process_list_init);
module_exit(process_list_exit);
MODULE_LICENSE("GPL");